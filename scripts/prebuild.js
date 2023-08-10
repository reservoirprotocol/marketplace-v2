const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

async function listFilesInDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath)
    return files
  } catch (err) {
    console.error('Error reading directory:', err)
  }
}

async function deleteAllFilesInDirectory(directoryPath) {
  try {
    const files = await fs.readdirSync(directoryPath)

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      await fs.unlinkSync(filePath)
    }
    return true
  } catch (err) {
    return true
  }
}

deleteAllFilesInDirectory('.cache').then(() => {
  exec(
    'tsc --module ES6 --outDir .cache ./utils/chains.ts',
    (error, stdout, stderr) => {
      const processFiles = async () => {
        const files = fs.readdirSync('.cache')
        for (fileId in files) {
          const file = files[fileId]
          if (file.endsWith('.js')) {
            const originalPath = path.join('.cache', file)
            const fileContents = await fs.readFileSync(originalPath, 'utf-8')
            let modifiedContents = fileContents
            files.forEach((filename) => {
              const filenameWithoutExt = `./${filename.replace('.js', "'")}`
              modifiedContents = modifiedContents.replace(
                filenameWithoutExt,
                `${filenameWithoutExt.replace("'", '')}.mjs'`
              )
            })
            await fs.writeFileSync(originalPath, modifiedContents, 'utf-8')
            const newPath = path.join('.cache', file.replace(/\.js$/, '.mjs'))
            await fs.renameSync(originalPath, newPath)
          }
        }
      }
      processFiles()
    }
  )
})
