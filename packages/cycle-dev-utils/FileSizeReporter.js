/**
 * BSD License
 * For create-react-app software
 *
 * Copyright (c) 2016-present, Facebook, Inc. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name Facebook nor the names of its contributors may be used to
 * endorse or promote products derived from this software without specific
 * prior written permission.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict'

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var filesize = require('filesize')
var recursive = require('recursive-readdir')
var stripAnsi = require('strip-ansi')
var gzipSize = require('gzip-size').sync

// Prints a detailed summary of build files.
function printFileSizesAfterBuild (webpackStats, previousSizeMap) {
  var root = previousSizeMap.root
  var sizes = previousSizeMap.sizes
  var assets = webpackStats
    .toJson()
    .assets.filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      var fileContents = fs.readFileSync(path.join(root, asset.name))
      var size = gzipSize(fileContents)
      var previousSize = sizes[removeFileNameHash(root, asset.name)]
      var difference = getDifferenceLabel(size, previousSize)
      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: size,
        sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : '')
      }
    })
  assets.sort((a, b) => b.size - a.size)
  var longestSizeLabelLength = Math.max.apply(
    null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  )
  assets.forEach(asset => {
    var sizeLabel = asset.sizeLabel
    var sizeLength = stripAnsi(sizeLabel).length
    if (sizeLength < longestSizeLabelLength) {
      var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
      sizeLabel += rightPadding
    }
    console.log(
      '  ' +
        sizeLabel +
        '  ' +
        chalk.dim(asset.folder + path.sep) +
        chalk.cyan(asset.name)
    )
  })
}

function removeFileNameHash (buildFolder, fileName) {
  return fileName
    .replace(buildFolder, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3)
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel (currentSize, previousSize) {
  var FIFTY_KILOBYTES = 1024 * 50
  var difference = currentSize - previousSize
  var fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red('+' + fileSize)
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow('+' + fileSize)
  } else if (difference < 0) {
    return chalk.green(fileSize)
  } else {
    return ''
  }
}

function measureFileSizesBeforeBuild (buildFolder) {
  return new Promise(resolve => {
    recursive(buildFolder, (err, fileNames) => {
      var sizes
      if (!err && fileNames) {
        sizes = fileNames
          .filter(fileName => /\.(js|css)$/.test(fileName))
          .reduce(
            (memo, fileName) => {
              var contents = fs.readFileSync(fileName)
              var key = removeFileNameHash(buildFolder, fileName)
              memo[key] = gzipSize(contents)
              return memo
            },
            {}
          )
      }
      resolve({
        root: buildFolder,
        sizes: sizes || {}
      })
    })
  })
}

module.exports = {
  measureFileSizesBeforeBuild: measureFileSizesBeforeBuild,
  printFileSizesAfterBuild: printFileSizesAfterBuild
}
