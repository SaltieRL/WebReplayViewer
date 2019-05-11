const path = require("path")
const fse = require("fs-extra")

function copyReadme() {
  return fse
    .copyFile(
      path.resolve(__dirname, "README.md"),
      path.resolve(__dirname, "lib", "README.md")
    )
    .then(() => console.log("Copied README.md"))
}

function copyAssets() {
  return fse
    .copy(
      path.resolve(__dirname, "src", "assets"),
      path.resolve(__dirname, "lib", "assets")
    )
    .then(() => console.log("Copied assets"))
}

function copyPackageJson() {
  return new Promise(resolve => {
    fse.readFile(
      path.resolve(__dirname, "package.json"),
      "utf-8",
      (err, data) => {
        if (err) throw err
        resolve(data)
      }
    )
  })
    .then(data => JSON.parse(data))
    .then(packageData => {
      const {
        devDependencies,
        main,
        types,
        module,
        scripts,
        ...other
      } = packageData

      const newPackage = {
        ...other,
        private: false,
        main: "./index.js",
        module: "./index.esm.js",
        typings: "./index.d.ts",
      }

      return new Promise(resolve => {
        const buildPath = path.resolve(__dirname, "lib", "package.json")
        const data = JSON.stringify(newPackage, null, 2)
        fse.writeFile(buildPath, data, err => {
          if (err) throw err
          console.log(`Created package.json in ${buildPath}`)
          resolve()
        })
      })
    })
}

copyPackageJson()
  .then(copyReadme)
  .then(copyAssets)
  .catch(console.error)
