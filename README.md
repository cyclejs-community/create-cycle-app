
# create-cycle-app

Create [Cycle.js](https://cycle.js.org/) apps with no build configuration.

# How to use it

> npm install --global create-cycle-app
> create-cycle-app my-awesome-cycle-app

Then choose the flavor and stream library you prefer. After installing dependencies, type:

> cd my-awesome-cycle-app
> npm start

# Custom flavor

You can inform which flavor you want to use:

> create-cycle-app foo --flavor cycle-scripts-es-browserify
> create-cycle-app foo --flavor cycle-scripts-es-browserify@x.y.z
> create-cycle-app foo --flavor ./relative/path/to/cycle-scripts-es-browserify

# Principles

## Single development dependency

Must be the first and only dependency needed to create a Cycle.js project, hiding tooling complexity and providing smart defaults.

## Flavors

Each flavor represents a pair of programming language and build tool. All the underlying dependencies and configuration needed must be hidden in behind the flavor. All flavors must adere to the same basic structure and commands.

### Available flavors

- cycle-scripts-es-browserify: ES6 (babel) + Browserify
- [Soon] cycle-scripts-es-webpack: ES6 (babel) + Webpack
- [Soon] cycle-scripts-ts-browserify: TypeScript + Browserify
- [Soon] cycle-scripts-ts-webpack: TypeScript + Webpack

## Simple commands

Each flavor must expose these commands:

- `npm start`: Start development server (possibly with [ live | hot module ] reload)
- `npm test`: Run the default test tool for each language
- `npm run build`: Generate a production-ready build content, on the `build` folder
- `npm run take-out-bike-wheels`: Copy flavor's dependencies and configurations to the project folder, update `package.json` and remove the dependency on `cycle-scripts`. This is irreversible.

## No lock-in

This is a tool focused on Cycle.js begginners and to provide fast bootstrap for new projects, and doesn't have the ambition to be **the** tool for working with Cycle.js projects in the long term. With that in mind, it's easy to leave `create-cycle-app` defaults and follow your own steps, by running the `take-out-bike-wheels` command.
