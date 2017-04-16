module.exports = replacements => `${replacements.import}
${replacements.typeImport}
import {DOMSource, VNode} from '@cycle/dom'

export type Sources = {
  DOM : DOMSource;
}

export type Sinks = {
  DOM : ${replacements.streamType}<VNode>;
}

export type Component = (s : Sources) => Sinks;
`
