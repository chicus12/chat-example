import os from 'os'
import fs from 'fs'
import path from 'path'
import uuid from 'uuid'
import async from 'async'
import dataURIBuffer from 'data-uri-to-buffer'
import { EventEmitter } from 'events'
import concat from 'concat-stream'
import listFiles from './list'
import ffmpeg from './ffmpeg'

export default (images) => {
  const events = new EventEmitter()
  let count = 0
  const baseName = uuid.v4()
  const tmpDir = os.tmpDir()
  let video

  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup
  ], convertFinished)

  // Decode images to files
  function decodeImages(done) {
    async.eachSeries(images, decodeImage, done)
  }

  // Decode a single image
  function decodeImage(image, done) {
    /* eslint no-plusplus: [0] */
    const fileName = `${baseName}-${count++}.jpg`
    const buffer = dataURIBuffer(image)
    const ws = fs.createWriteStream(path.join(tmpDir, fileName))

    ws.on('error', done)
      .end(buffer, done)

    events.emit('log', `Converting ${fileName}`)
  }

  // Create video from images with ffmpeg
  function createVideo(done) {
    events.emit('log', 'Creating video')
    ffmpeg({
      baseName,
      folder: tmpDir,
    }, done)
  }

  // Encode video
  function encodeVideo(done) {
    const fileName = `${baseName}.webm`
    const rs = fs.createReadStream(path.join(tmpDir, fileName))

    events.emit('log', `Encoding video ${fileName}`)

    rs.pipe(concat((videoBuffer) => {
      video = `data:video/webm;base64,${videoBuffer.toString('base64')}`
      done()
    }))

    rs.on('error', done)
  }

  // Cleanup temp folder
  function cleanup(done) {
    events.emit('log', 'Cleaning up')

    listFiles(tmpDir, baseName, (err, files) => {
      if (err) return done(err)

      // delete files
      return deleteFiles(files, done)
    })
  }

  // Delete all files
  function deleteFiles(files, done) {
    async.each(files, deleteFile, done)
  }

  // Delete one file
  function deleteFile(file, done) {
    events.emit('log', `Deleting ${file}`)

    fs.unlink(path.join(tmpDir, file), () => {
      // ignore error
      done()
    })
  }

  // Convertion finished
  function convertFinished(err) {
    if (err) return events.emit('error', err)

    events.emit('video', video)
  }

  return events
}
