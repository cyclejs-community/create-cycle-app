# Create Cycle App

Create [Cycle.js](https://cycle.js.org/) apps with no build configuration.

* [Principles](#principles) – The philosophy behind create-cycle-app
* [Why Use This](#why-use-this) – When to use create-cycle-app
* [Getting Started](#getting-started) – How to create a new app.
* [Custom Flavors](#flavors) – How to develop and publish new flavors

## Quick Start

```sh
$ npm install -g create-cycle-app
$ create-cycle-app my-awesome-cycle-app
```

You will be prompted to choose the flavour and stream library you prefer.

<img src='https://raw.githubusercontent.com/cyclejs-community/create-cycle-app/master/docs/create-cycle-app-select-flavor.png' width='600' alt='create-cycle-app-select-flavor'>

<img src='https://raw.githubusercontent.com/cyclejs-community/create-cycle-app/master/docs/create-cycle-app-select-streamLib.png' width='600' alt='create-cycle-app-select-stream-library'>

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

* **One dependency:** The first and only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults.

* **Zero Configuration:** There are no configuration files. Configuring both development and production builds is handled for you so you can focus on writing code.

* **Many Flavors:** We like to be together not the same, that’s why create-cycle-app comes with 4 core flavors that you can mix and match with your favorite reactive stream library. Furthermore, a discovery mechanism allows to find and use any flavor published on the npm registry. Alternatively, you can use your own flavors from any registry such as GitHub or your own.

* **No Lock-In:** Specifically made for beginners and to provide fast bootstrap for new projects, create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. With that in mind, it's easy to leave `create-cycle-app` defaults and follow your own steps, by running `npm run eject`.

## Why Use This?

**If you’re getting started** with Cycle.js, use `create-cycle-app` to automate the build of your app. There is no configuration file, and `cycle-scripts-<flavorName>` is the only extra build dependency in your `package.json`. Your environment will have everything you need to build a Cycle.js app.

**If you’re a power user** simply use it as a boilerplate generator, by passing in your own flavor.


## Getting Started

### Installation

Installing globally provides a create-cycle-app command for creating new projects.

```sh
$ npm install --g create-cycle-app
```

**We recommend** to use Node >= 6 and npm >= 3 for faster installation speed and better disk usage. You can use a node version manager(i.e [nodenv](https://github.com/nodenv/nodenv), [nvm](https://github.com/creationix/nvm), [n](https://github.com/tj/n)) to easily switch Node versions among different projects.

### Creating an App

To create a new cycle.js app, run:

```
$ create-cycle-app my-awesome-cycle-app
$ cd my-awesome-cycle-app
```

It will create a directory called `my-awesome-cycle-app` inside the current folder.
Inside that directory, it will generate the following initial project structure* and install the required dependencies.

```
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

_* Generated structure and files may change depending on the flavor being used, The above structure hold true for any of the 4 core flavors._

No configuration or complicated folder structures, just the files you need to build your cycle app.
Once the installation is done, you can run the following commands from within the project folder:

### `npm start`

Runs the app in development mode by starting the development server.

Server will be listening on port 8000

### `npm test`
Run the default test tool.

(Some flavors could create a test folder, but this folder is gitignored)

### `npm run build`

Generate a production-ready build content, on the build folder (this folder is gitignored)

### `npm run eject`

Copy dependencies and configurations to the project folder, update package.json and remove the dependency on the flavored cycle-scripts.

**This is irreversible.**

## Flavors
Each flavor represents a pair of programming language and builds tool. All the underlying dependencies and configuration are hidden behind the flavor. All flavors must adhere to the same basic structure and commands. Please make sure to check a specific flavor documentation for more details.

### Core flavors

Create-cycle-app come packed with 4 core flavors for you to choose from, namely:

* [ES6 (babel) + Browserify](https://github.com/cyclejs-community/create-cycle-app/blob/master/cycle-scripts-es-browserify)
* [ES6 (babel) + Webpack](https://github.com/cyclejs-community/create-cycle-app/blob/master/cycle-scripts-es-webpack)
* [TypeScript + Browserify](https://github.com/cyclejs-community/create-cycle-app/blob/master/cycle-scripts-ts-browserify)
* [TypeScript + Webpack](https://github.com/cyclejs-community/create-cycle-app/blob/master/cycle-scripts-ts-webpack)

### Custom flavour

Custom flavors allow generating starting projects to fulfil specific needs.
They can be published to npm, becoming instantaneously available to everybody via the create-cycle-app CLI.

#### How to use custom flavors

##### Providing your own
When creating a project, you can inform which flavor you want to use with the `--flavor` flag:

```sh
$ create-cycle-app <name> --flavor <flavor>
```
Some examples of how a flavor could be specified:

```
$ create-cycle-app my-app --flavor cycle-scripts-es-webpack

$ create-cycle-app my-app --flavor cycle-scripts-es-webpack@x.y.z

$ create-cycle-app my-app --flavor ./relative/path/to/cycle-scripts-es-webpack
```

##### Discovering published flavors

If no `--flavor` flag is passed, `create-cycle-app` will allow you to discover more flavors aside the core ones.
Create-cycle-app will look up on the NPM registry for published flavors and if any get selected install it from there.

<img src='https://raw.githubusercontent.com/cyclejs-community/create-cycle-app/master/docs/create-cycle-app-discover-flavor.png' width='600' alt='create-cycle-app-discover-flavor'>

#### How to create a custom flavor
A flavor is a npm module with a set of scripts and template files that are used to configure a new Cycle.js project.

Take a look at [cycle-scripts-es-browserify](./cycle-scripts-es-browserify) as an example.

##### Basic structure

```
.
├── index.js
├── package.json
├── scripts
│   ├── build.js
│   ├── init.js
│   ├── start.js
│   ├── eject.js
│   └── test.js
└── template
    ├── gitignore
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── src
        ├── app.js
        ├── app.test.js
        └── index.js

4 directories, 13 files
```

`package.json` is used to declare dependencies for this particular flavor, that acts as devDependencies to the target project. It declares the `cycle-scripts` command script (generally `index.js`), from where each underlying scripts is called.

`index.js` is the entry point for each command exposed to the target project. It could be really simple, just calling the next script file without ceremony.

`scripts/` directory holds each script used in the project. The `start.js` script is used to start a development server. `test.js`, as the name suggests, call the test tool. `build.js` is used to bundle the target project to a deliverable set of files, production-ready. `eject.js` is mostly a copy-and-paste tool, that adapts the target project to reproduce the same commands from the flavor. Last, but not least, `init.js` is the script called by `create-cycle-app` command, in order to install development dependencies and copy initial files.

`templates/` directory holds template files for the target project. This is optional, and unlike other files, could have any structure you desire.

Each flavor has great freedom to choose it's own dependencies, configuration, tools and file structure, as the user will choose which is the best (desired) flavor.

##### Example:

A flavor starring Semicolons!, browserify, babel and the object spread babel plugin with a really long name!
Check it out [here](https://github.com/Widdershin/cycle-scripts-widdershin)

#### Publish

If you want your flavor to be used upfront by anyone, just publish it on the NPM registry. Make sure to use the keyword `create-cycle-app-flavor` and add a short self-explanatory description in your flavor's package.json.

## Contributing

We'd love to have your help on `create-cycle-app`. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## Acknowledgements

A simple thank you goes a long way. That's why we would like to thank the [create-react-app](https://github.com/facebookincubator/create-react-app) team: you have been a fantastic inspiration and a great example for this project.

## Alternatives

Create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. You might want to explore alternatives. Check [awesome-cycle](https://github.com/cyclejs-community/awesome-cyclejs#boilerplates) for a list of boilerplates.
