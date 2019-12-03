# Replay Viewer

[![NPM package][npm]][npm-url]
[![Language Grade][lgtm]][lgtm-url]
[![Discord][discord]][discord-url]

[npm]: https://img.shields.io/npm/v/replay-viewer
[npm-url]: https://www.npmjs.com/package/replay-viewer
[lgtm]: https://img.shields.io/lgtm/grade/javascript/github/SaltieRL/WebReplayViewer.svg?label=code%20quality
[lgtm-url]: https://lgtm.com/projects/g/SaltieRL/WebReplayViewer/
[discord]: https://img.shields.io/discord/482991399017512960.svg?colorB=7581dc&logo=discord&logoColor=white
[discord-url]: https://discord.gg/EaFRh7v

An extension of the [DistributedReplays](https://github.com/SaltieRL/DistributedReplays) website, this library aims to provide a React component + utilities for displaying a Rocket League replay viewer in WebGL using Three.js

## Setup

### Unix

First thing's first: install all of your dependencies. We rely on [Webpack](https://webpack.js.org/) as a bundler and [Babel](https://babeljs.io/) as a transpiler, so most dependencies are plugins for this project.

```bash
$ npm install
```

### Developing

To launch a hot-reloading configuration, run the following. All file changes will be detected and will cause the package to re-bundle. The examples current live inside of the `docs/` folder but can be modified to show off newer features.

```bash
$ npm start
```

If you would like to test with a compiled version of the app, you can run the following command to link the package globally. Then, you can import the bundle as you normally would by replacing instances of `../src/foo` with `replay-viewer/foo`. This will tell the `docs/` directory to treat this package as though it were installed inside your `node_modules/` directory.

```bash
$ npm run link
```

### Building

After ensuring that your build successfully compiles, you can build using the pre-configured build scripts. When you're ready to build, the build scripts will generate typescript declaration files and source maps inside the `lib/` folder for your consumption. When in doubt, look at where the `main` value is set in the `package.json` file.

```bash
$ npm run build
```
