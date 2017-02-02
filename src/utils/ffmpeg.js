import os from 'os'
import path from 'path'
import { spawn } from 'child_process'

export default (options, callback) => {
  if (!options.baseName) return callback(new TypeError('You must specify a baseName'))

  const folder = options.folder || os.tmpDir()
  const baseName = options.baseName
  const fileSrc = path.join(folder, `${baseName}-%d.jpg`)
  const fileDest = path.join(folder, `${baseName}.webm`)

  // ffmpeg -i images-%d.jpg -filter:v "setpts=2.5*PTS" -vcodec libvpx -an video.webm
  const ffmpeg = spawn('ffmpeg', [
    '-i',
    fileSrc,
    '-filter:v',
    'setpts=2.5*PTS',
    '-vcodec',
    'libvpx',
    '-an',
    fileDest,
  ])

  ffmpeg.stdout.on('close', (code) => {
    if (!code) return callback(null)

    return callback(new Error(`ffmpeg exited with code ${code}`))
  })
}
