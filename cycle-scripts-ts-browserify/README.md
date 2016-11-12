# Cycle Scripts TypeScript Browserify

[Create-cycle-app](https://github.com/cyclejs-community/create-cycle-app)  core flavor.

## Language

TypeScript

## Bundler

Browserify configured with
* [Budo dev server](https://github.com/mattdesl/budo)
* Live reload

## Scripts

- `npm start`: Start development server listening on port 8000
- `npm test`: Run the default test tool
- `npm run build`: Generate a production-ready build content, on the `build` folder (this folder is *gitignored*)
- `npm run eject`: Copy flavor's dependencies and configurations to the project folder, update `package.json` and remove the dependency on the flavored `cycle-scripts`. This is irreversible.


## Boilerplate:

The flavor generate the following file structure:

```
my-awesome-cycle-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── app.ts
│   ├── app.test.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Config files
* .tsconfig.json
