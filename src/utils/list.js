import fs from 'fs'

export default (folder, filter, callback) => {
  fs.readdir(folder, onReaddir)

  function onReaddir(err, results) {
    if (err) return callback(err)

    const files = results.filter(filterFiles)

    callback(null, files)
  }

  function filterFiles(file) {
    return file.startsWith(filter)
  }
}
