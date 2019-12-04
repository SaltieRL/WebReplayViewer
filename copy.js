const path = require("path")
const fse = require("fs-extra")

async function copyReadme() {
  return fse
    .copyFile(
      path.resolve(__dirname, "README.md"),
      path.resolve(__dirname, "lib", "README.md")
    )
    .then(() => console.log("Copied README.md"))
}

async function copyPackageJson() {
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
  .catch(console.error)
