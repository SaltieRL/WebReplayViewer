const https = require("https")
const fs = require("fs")

const getArg = (flagName) => {
  const flagIdx = process.argv.indexOf(`--${flagName}`)
  if (flagIdx === -1) {
    return
  }
  // Return true if flag is not succeeded by value
  if (
    flagIdx + 1 === process.argv.length ||
    process.argv[flagIdx + 1].startsWith("--")
  ) {
    return true
  }
  // Return succeeding value
  return process.argv[flagIdx + 1]
}

const mode = (() => {
  const val = getArg("mode")
  switch (val) {
    case undefined:
    case "wasm":
      return "wasm"
    case "js":
      return "js"
    default:
      throw new Error(
        `Illegal mode ${val} specified. Please use "wasm" or "js"`
      )
  }
})()

const variation = (() => {
  const val = getArg("variation")
  switch (val) {
    case undefined:
    case "default":
      return "default"
    case "gltf":
      return "gltf"
    default:
      throw new Error(
        `Illegal variation ${val} specified. Please use "default" or "gltf"`
      )
  }
})()

const WRITE_PATH = "public/draco/"

const filesToDownload =
  mode === "wasm"
    ? ["draco_decoder.wasm", "draco_wasm_wrapper.js"]
    : ["draco_decoder.js"]
const urlPath = `https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/${
  variation === "gltf" ? "gltf/" : ""
}`

filesToDownload.forEach((file) => {
  console.log(`Fetching ${file}...`)
  const dest = WRITE_PATH + file
  // Delete existing
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest)
  }
  // Create new file
  const writeStream = fs.createWriteStream(dest)
  https
    .get(urlPath + file, (response) => {
      response.pipe(writeStream)
      writeStream.on("finish", () => {
        writeStream.close()
        console.log(`Finished writing ${file}`)
      })
    })
    .on("error", (err) => {
      fs.unlink(dest)
      console.error(err)
    })
})
