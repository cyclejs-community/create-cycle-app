# Create Cycle App

Create [Cycle.js](https://cycle.js.org/) apps with no build configuration.

* [Principles](#principles) – The philosophy behind create-cycle-app
* [Why Use This](#why-use-this) – When to use create-cycle-app
* [Getting Started](#getting-started) – How to create a new app.
* [Custom Flavors](#flavors) – How to develop and publish new flavors

The project is inspired by [create-react-app](https://github.com/facebookincubator/create-react-app)

## Quick Start

```sh
$ npm install -g create-cycle-app
$ create-cycle-app my-awesome-cycle-app
```

Once your app has been created a success message with further info will be displayed:

<img src='https://raw.githubusercontent.com/cyclejs-community/create-cycle-app/master/docs/create-cycle-app.png' width='600' alt='create-cycle-app-success'>

Then, simply follow the suggestion in your terminal and type:

```sh
$ cd my-awesome-cycle-app/
$ npm start
```

<img src='https://raw.githubusercontent.com/cyclejs-community/create-cycle-app/master/docs/npm-start.png' width='600' alt=’npm-start’>

Open your browser at [http://localhost:8000](http://localhost:8000) to see your app.

Once you’re ready to deploy to production, create a minified bundle with

```sh
$ npm run build
```

## Principles

* **One dependency:** The only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults. Just update `create-cycle-app` to get selected changes to the core flavors.

* **Zero Configuration:** No configuration files. Configuring both development and production builds is handled for you. Focus on writing code.

* **Many Flavors:** We like to be together not the same, that’s why create-cycle-app comes with 1 core flavors but allows you to provide your own from any registry such as GitHub or your own.

* **No Lock-In:** Specifically made for beginners and to provide fast bootstrap for new projects. `create-cycle-app` doesn't have the ambition to be __the__ tool for working with Cycle.js projects. With that in mind, it's easy to leave `create-cycle-app` defaults and follow your own steps, by running `npm run eject`.

## Why Use This?

**If you’re getting started** with Cycle.js, use `create-cycle-app` to automate the build of your app. There is no configuration file, and `cycle-scripts-<flavorName>` is the only extra build dependency in your `package.json`. Your environment will have everything you need to build a Cycle.js app.

**If you’re a power user** simply use it as a boilerplate generator, by passing in your own flavor.

**To customise** the build or compile process, you need to first `eject` the dependencies and configurations into the project root folder. Then you can customize from there as usual.

## Getting Started

### Installation

Install the module globally and a `create-cycle-app` binary command will be made available for creating new projects.

```sh
$ npm install --g create-cycle-app
```

**We recommend** using Node >= 6 and npm >= 3 for faster installation speed and better disk usage. You can use a node version manager(i.e [nodenv](https://github.com/nodenv/nodenv), [nvm](https://github.com/creationix/nvm), [n](https://github.com/tj/n)) to easily switch Node versions among different projects.

`sudo n latest` - Install latest Node version

### Creating an App

To create a new cycle.js app, run:

```sh
$ create-cycle-app my-awesome-cycle-app
$ cd my-awesome-cycle-app
```

It will create a directory called `my-awesome-cycle-app` inside the current folder.
Inside that directory, it will generate the following initial project structure and install the required dependencies.

```sh
my-awesome-cycle-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── app.js
│   ├── app.test.js
│   └── index.js
└── package.json
```

_* Generated structure and files may change depending on the flavor being used, The above structure holds true for the core flavor._

No configuration or complicated folder structures, just the files you need to build your cycle app. Once the installation is done, you can run the following commands from within the project folder:

### `npm start`

Runs the app in development mode by starting the development server.

Server will be listening on port 8000

### `npm test`
Run the default test tool.

(Some flavors could create a test folder, but this folder is gitignored)

### `npm run build`

Generate a production-ready build content, on the build folder (this folder is gitignored)

### `npm run eject`

Copy dependencies and configurations to the project folder, update `package.json` and remove the dependency on the flavored cycle-scripts.

**This is irreversible.**

## Flavors
Each flavor represents a pair of programming language and builds tool. All the underlying dependencies and configuration are hidden behind the flavor. All flavors must adhere to the same basic structure and commands. Please make sure to check a specific flavor documentation for more details.

### Core flavor

Create-cycle-app comes pre-packaged with this core flavor:

* [cycle-scripts](https://github.com/cyclejs-community/create-cycle-app/blob/master/packages/cycle-scripts)

### Using a custom flavor

Custom flavors allow generating starting projects to fulfil specific needs.
They can be published to npm or a git repo or even be referenced locally (esp. useful when you create your _own_ custom flavor - see below)

#### How to use custom flavors

##### Providing your own
When creating a project, you can specify which flavor to use with the `--flavor` flag:

```sh
$ create-cycle-app <name> --flavor <flavor>
```

The flavor will be installed via `npm install` and can therefore reference any flavor resource installable via `npm`

Some examples of how a flavor can be specified:

*npm name*

```sh
$ create-cycle-app my-app --flavor cycle-scripts-one-fits-all
```

*npm name with specific version*

```sh
$ create-cycle-app my-app --flavor cycle-scripts-one-fits-all@1.1.0
```

*github account/repo*

```sh
$ create-cycle-app my-app --flavor github:my-account/my-cycle-flavor
```

*reference to local file path*

```sh
$ create-cycle-app my-app --flavor ./relative/path/to/my-cycle-flavor
```

##### Flavors:

- Check [available flavors](https://github.com/cyclejs-community/create-cycle-app-flavors)

### Creating a custom flavor

Copy an existing flavor to a local folder and reference via the local file path.

Example: Extend default `cycle-scripts` flavor

When you create a new project, the default `cycle-scripts` is installed in `node_modules` of your project. You can simply copy this package and work from there, using it as a simple base.

```sh
$ cp node_modules/cycle-scripts ./cycle-flavors
```

The default flavor package has the following structure:

```
/scripts
  /configs
    .babelrc
  build.js
  eject.js
  init.js
  start.js
  test.js

/template
  /public
  /src
index.js
package.json
Readme.md
```

## Single flavor from lerna project

If you want to use a [lerna](https://github.com/lerna/lerna) repo with multiple packages, you can make a [sparse checkout](https://gist.github.com/sumardi/5559896) of the specific package you want to use as the base.

We recommend you use [one-fits-all](https://github.com/cyclejs-community/create-cycle-app-flavors/tree/master/packages/cycle-scripts-one-fits-all) as a baseline (note: it uses [webpack-blocks](https://github.com/andywer/webpack-blocks))

```sh
$ pwd
~/cycle-projects

$ mkdir cycle-flavors && cd cycle-flavors
$ git init <repo>
$ cd <repo>
$ git remote add origin <url>
$ git config core.sparsecheckout true
$ echo "packages/<flavor-package>" >> .git/info/sparse-checkout
$ git pull --depth=1 origin master
$ cd ..
```

## Lerna: using a shell script

To facilitate using lerna flavors from git you can store this recipe as a shell script, like this:

```sh
#!/bin/sh

# $1 repo name
# $2 git repo url
# $3 flavor package name (lerna)
function cycle-flavor() {
  $DEFAULT_FLAVOR_REPO=my-flavor
  $DEFAULT_FLAVOR_GIT_URL=https://github.com/cyclejs-community/create-cycle-app-flavors.git
  $DEFAULT_FLAVOR_PACKAGE=cycle-scripts-one-fits-all

  FL_NAME=${1:-DEFAULT_FLAVOR_REPO}
  FL_PACKAGE=${2:-DEFAULT_FLAVOR_PACKAGE}
  FL_GIT_URL=${3:-DEFAULT_FLAVOR_GIT_URL}

  git init $FL_NAME && cd $FL_NAME
  git remote add origin $FL_GIT_URL
  $ git config core.sparsecheckout true
  $ echo "packages/$FL_PACKAGE" >> .git/info/sparse-checkout
  $ git pull --depth=1 origin master
  $ cd ..
}
```

## Using shell script

All defaults

```sh
$ cycle-flavor [my-flavor] [cycle-scripts-one-fits-all][https://github.com/cyclejs-community/create-cycle-app-flavors.git]
```

Specify name of local repo to create as flavor "container"

```sh
$ cycle-flavor my-new-flavor [cycle-scripts-one-fits-all][https://github.com/cyclejs-community/create-cycle-app-flavors.git]
```

Specify local repo and which remote lerna package to use as base

```sh
$ cycle-flavor my-sweet-flavor cycle-scripts-ts-browserify[https://github.com/cyclejs-community/create-cycle-app-flavors.git]
```

Specify local repo, remote lerna package and git location

```sh
$ cycle-flavor my-sweet-flavor cycle-scripts-ts-browserify https://github.com/my-account/my-cycle-flavors.git
```

Now from `~/cycle-projects` reference your local custom flavor of choice :)

```sh
$ create-cycle-app my-app --flavor ./cycle-flavors/flavor-package
```

## Multiple local lerna flavors

`create-cycle-app` uses [lerna](https://github.com/lerna/lerna) a useful tool suite to manage multiple related repos/projects

If you want to go this way, simply clone `create-cycle-app-flavors`

```sh
$ git clone https://github.com/cyclejs-community/create-cycle-app-flavors
```

Then remove any packages you want to discard and modify the packages you want to use
to suit you needs. Please read the lerna guide and use the lerna wizard and/or modify `lerna.json` to match your packages configuration.

Alternatively create a brand new lerna project using the lerna CLI and go from there...

## Publishing a local flavor

When you have tested your local custom flavor and are happy with it, you can publish it to a git repo or perhaps to npm to make it accessible for the Cycle.js community. You can even make a "shout-out" on the Gitter channel, notifying the community about your creation for the benefit of all.

## Contributing

We'd love to have your help on `create-cycle-app`. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

Please notice that this project is a *lerna* project with sub-projects under `/packages`. These packages are published separately to npm.

## Acknowledgements

A simple thank you goes a long way. That's why we would like to thank the [create-react-app](https://github.com/facebookincubator/create-react-app) team: you have been a fantastic inspiration and a great example for this project.
We would also like to thank the [standard project](https://github.com/feross/standard) for their update-authors script.

## Alternatives

Create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. You might want to explore alternatives. Check [awesome-cycle](https://github.com/cyclejs-community/awesome-cyclejs#boilerplates) for a list of boilerplates.
