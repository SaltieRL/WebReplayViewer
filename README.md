# Replay Viewer

An extension of the [DistributedReplays](https://github.com/SaltieRL/DistributedReplays) website, this library aims to provide a React component + utilities for displaying a Rocket League replay viewer in WebGL using Three.js

## Setup

### Unix

First thing's first: install all of your dependencies. We rely on [Rollup](https://rollupjs.org/guide/en) as a bundler, so most dependencies are plugins for this project.

```bash
$ npm install
```

To launch a hot-reloading configuration, run the following. All file changes will be detected and will cause the package to rebundle.

```bash
$ npm run start
```

When you're ready to build, the build scripts will generate typescript declaration files and source maps inside the `/lib` folder for your consumption. When in doubt, look at where the `main` value is set in the `package.json` file.

```bash
$ npm run build
```

Finally, to load this package into an example build, run the following command. This will tell the `examples/` directory to treat this package as though it were installed inside your `node_modules/` directory.

```bash
$ npm run link
```

When you're ready, you can launch the React example by navigating to the examples directory and running the start script

```bash
$ cd examples/ && npm run start
```
