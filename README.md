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

* **One dependency:** The first and only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults. Just update `create-cycle-app` to get selected changes to the core flavors.

* **Zero Configuration:** There are no configuration files. Configuring both development and production builds is handled for you so you can focus on writing code.

* **Many Flavors:** We like to be together not the same, that’s why create-cycle-app comes with 1 core flavors but allows you to provide your own from any registry such as GitHub or your own.

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

_* Generated structure and files may change depending on the flavor being used, The above structure hold true for the core flavor._

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

### Core flavor

Create-cycle-app come packed with 1 core flavor:

* [cycle-scripts](https://github.com/cyclejs-community/create-cycle-app/blob/master/packages/cycle-scripts)

### Custom flavour

Custom flavors allow generating starting projects to fulfil specific needs.
They can be published to npm, or being used locally via the create-cycle-app CLI.

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

##### Flavors:

- Check [available flavors](https://github.com/cyclejs-community/create-cycle-app-flavors)

## Contributing

We'd love to have your help on `create-cycle-app`. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## Acknowledgements

A simple thank you goes a long way. That's why we would like to thank the [create-react-app](https://github.com/facebookincubator/create-react-app) team: you have been a fantastic inspiration and a great example for this project.
We would also like to thank the [standard project](https://github.com/feross/standard) for their update-authors script.

## Alternatives

Create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. You might want to explore alternatives. Check [awesome-cycle](https://github.com/cyclejs-community/awesome-cyclejs#boilerplates) for a list of boilerplates.
