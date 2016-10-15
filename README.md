
# create-cycle-app

Create [Cycle.js](https://cycle.js.org/) apps with no build configuration.

# How to use it

  ```sh
  $ npm install --global create-cycle-app

  $ create-cycle-app my-awesome-cycle-app
  ```

Then choose the flavor and stream library you prefer. After installing dependencies, type:

  ```sh
  $ cd my-awesome-cycle-app

  $ npm start
  ```

# Custom flavor

You can inform which flavor you want to use:

  ```sh
  $ create-cycle-app foo --flavor cycle-scripts-es-browserify

  $ create-cycle-app foo --flavor cycle-scripts-es-browserify@x.y.z

  $ create-cycle-app foo --flavor ./relative/path/to/cycle-scripts-es-browserify
  ```

# Principles

## Single development dependency

Must be the first and only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults.

## Flavors

Each flavor represents a pair of programming language and build tool. All the underlying dependencies and configuration needed must be hidden behind the flavor. All flavors must adhere to the same basic structure and commands.

### Available flavors

- cycle-scripts-es-browserify: ES6 (babel) + Browserify
- cycle-scripts-ts-browserify: TypeScript + Browserify
- cycle-scripts-es-webpack: ES6 (babel) + Webpack
- [Soon] cycle-scripts-ts-webpack: TypeScript + Webpack

## Simple commands

Each flavor expose these commands:

- `npm start`: Start development server (possibly with [ live | hot module ] reload)
- `npm test`: Run the default test tool for each language
- `npm run build`: Generate a production-ready build content, on the `build` folder
- `npm run take-off-training-wheels`: Copy flavor's dependencies and configurations to the project folder, update `package.json` and remove the dependency on the flavored `cycle-scripts`. This is irreversible.

## No lock-in

This is a tool focused on Cycle.js beginners and to provide fast bootstrap for new projects, and doesn't have the ambition to be **the** tool for working with Cycle.js projects in the long term. With that in mind, it's easy to leave `create-cycle-app` defaults and follow your own steps, by running `npm run take-off-training-wheels`.

# How to create a custom flavor

A flavor is a npm module with a set of scripts and template files that is used to configure a new Cycle.js project.

Take a look at [cycle-scripts-es-browserify](./cycle-scripts-es-browserify) as an example.

## Basic structure

```
.
├── index.js
├── package.json
├── scripts
│   ├── build.js
│   ├── init.js
│   ├── start.js
│   ├── take-off-training-wheels.js
│   └── test.js
└── template
    ├── gitignore
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── src
        ├── app.js
        ├── app.test.js
        └── index.js

4 directories, 13 files
```

`package.json` is used to declare dependencies for this particular flavor, that acts as devDependencies to the target project. It declares the `cycle-scripts` command script (generally `index.js`), from where each underlying scripts is called.

`index.js` is the entry point for each command exposed to the target project. It could be really simple, just calling the next script file without ceremony.

`scripts/` directory holds each script used in the project. The `start.js` script is used to start a development server. `test.js`, as the name suggests, call the test tool. `build.js` is used to bundle the target project to an deliverable set of files, production-ready. `take-off-training-wheels.js` is mostly a copy-and-paste tool, that adapts the target project to reproduce the same commands from the flavor. Last, but not least, `init.js` is the script called by `create-cycle-app` command, in order to install development dependencies and copy initial files.

`templates/` directory holds template files for the target project. This is optional, and unlike other files, could have any structure you desire.

Each flavor has great freedom to choose it's own dependencies, configuration, tools and file structure, as the user will choose which is the best (desired) flavor.

To use the custom flavor, you could run the command:

```sh
$ create-cycle-app <name> --flavor <flavor>
```

`<flavor>` could be a name of a published flavor, a `.tar` file, a git URL, or basically, anything that `npm` could install and node could require.

## Publishing

If you want your flavor published in the up front list, please, drop an issue referring the repository or npm package, and we will put it on our [highly advanced publishing system](https://gist.github.com/geovanisouza92/0f33b55f62baca22c6bdb73b56333311).
