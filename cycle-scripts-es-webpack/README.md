
# Cycle Scripts ES Webpack

[Create-cycle-app](https://github.com/cyclejs-community/create-cycle-app)  core flavor.

## Language

ES6 ( Babel ) configured with:
* [ES2015 preset](https://babeljs.io/docs/plugins/preset-es2015/)

## Bundler

Webpack configured with
* [Webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html)
* [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html)

## Scripts

- `npm start`: Start development server listening on port 8000
- `npm test`: Run the default test tool
- `npm run build`: Generate a production-ready build content, on the `build` folder (this folder is *gitignored*)
- `npm run take-off-training-wheels`: Copy flavor's dependencies and configurations to the project folder, update `package.json` and remove the dependency on the flavored `cycle-scripts`. This is irreversible.


## Boilerplate:

The flavor generate the following file structure:

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

### Config files
* .babelrc (Added on the root after running the take-off-training-wheels script)

