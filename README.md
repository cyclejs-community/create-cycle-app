# Create Cycle App

Create [Cycle.js](https://cycle.js.org/) apps with no build configuration.

* [Getting Started](#getting-started) – How to create a new app.
* [Custom Flavors](#flavors) – How to develop and publish new flavors

## Quick Start

```sh
$ npm install —g create-cycle-app
$ create-cycle-app my-awesome-cycle-app
```

You will be prompted to choose the flavour and stream library you prefer.

<img src='https://gist.githubusercontent.com/nickbalestra/1ccf4730b2d48e46a8badba9eeefbcd9/raw/09050074f7cf9e29442bd196046024f4fec71464/create-cycle-app-select-flavor.png' width='600' alt='create-cycle-app-select-flavor'>

<img src='https://gist.githubusercontent.com/nickbalestra/1ccf4730b2d48e46a8badba9eeefbcd9/raw/09050074f7cf9e29442bd196046024f4fec71464/create-cycle-app-select-streamLib.png' width='600' alt='create-cycle-app-select-stream-library'>

<img src='https://gist.githubusercontent.com/nickbalestra/1ccf4730b2d48e46a8badba9eeefbcd9/raw/70a21579e75e1e02bda38e8d3de807d709fe9a1e/create-cycle-app.png' width='600' alt='create-cycle-app-success'>

Then, simply follow the suggestion in your terminal and type:

```sh
$ cd my-awesome-cycle-app/
$ npm start
```

<img src='https://gist.githubusercontent.com/nickbalestra/1ccf4730b2d48e46a8badba9eeefbcd9/raw/724e9b02b73fc370ebd5869c5e9fae7bf3a2f08b/npm-start.png' width='600' alt=’npm-start’>

Open your browser at [http://localhost:8000](http://localhost:8000) to see your app.

Once you’re ready to deploy to production, create a minified bundle with

```sh
$ npm run build
```

## Principles

* **One dependency:** The first and only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults.

* **Zero Configuration:** There are no configuration files. Configuring both development and production builds is handled for you so you can focus on writing code.

* **Many Flavors:** We like to be together not the same, that’s why create-cycle-app comes with 4 core flavors that you can mix and match with your favorite reactive stream library. Furthermore, a discovery mechanism allows to find and use any flavor published on the npm registry. Alternatively, you can use your own flavors from any registry such as GitHub or your own.

* **No Lock-In:** Specifically made for beginners and to provide fast bootstrap for new projects, create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. With that in mind, it's easy to leave `create-cycle-app` defaults and follow your own steps, by running `npm run take-off-training-wheels`.

## Why Use This?

**If you’re getting started** with Cycle.js, use `create-cycle-app` to automate the build of your app. There is no configuration file, and `cycle-scripts-<flavorName>` is the only extra build dependency in your `package.json`. Your environment will have everything you need to build a Cycle.js app.

**If you’re a power user** simply use it as a boilerplate generator, by passing in your own flavor.


## Getting Started
### Installation
### Creating an App
### `npm start`
### `npm test`
### `npm run build`
### `npm run take-off-training-wheels`
### How to Update to New Versions?

## Flavors
### Core flavors
### Custom flavour
#### How to create a custom flavor
#### Basic structure
#### Publish

## Contributing

We'd love to have your help on `create-cycle-app`. See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.


## Alternatives

Create-cycle-app doesn't have the ambition to be __the__ tool for working with Cycle.js projects. You might want to explore alternatives. Check [awesome-cycle](https://github.com/cyclejs-community/awesome-cyclejs#boilerplates) for a list of boilerplates.
