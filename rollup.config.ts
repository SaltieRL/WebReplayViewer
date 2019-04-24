/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path"
import pkg from "./package.json"
import typescript from "typescript"
import typescriptPlugin from "rollup-plugin-typescript2"
import babel from "rollup-plugin-babel"
import nodeResolve from "rollup-plugin-node-resolve"
import { uglify } from "rollup-plugin-uglify"

const tsconfig = path.join(__dirname, "tsconfig.json")
console.info(`Using tsconfig: ${tsconfig}`)

const input = "./src/index.ts"

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "prop-types": "PropTypes",
}

const external = id => !id.startsWith(".") && !id.startsWith("/")

const extensions = [".ts", ".tsx"]

const babelOptions = {
  babelrc: false,
  extensions,
}

const commonjsOptions = {
  include: /node_modules/,
}

export default [
  {
    input,
    external,
    output: {
      name: pkg.name,
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ extensions }),
      typescriptPlugin({ typescript, tsconfig }),
      babel(babelOptions),
      uglify(),
    ],
  },

  {
    input,
    external,
    output: {
      file: "lib/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ extensions }),
      typescriptPlugin({ typescript, tsconfig }),
      babel(babelOptions),
    ],
  },
]
