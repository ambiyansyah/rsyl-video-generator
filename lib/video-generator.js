'use strict'

const videoshow = require('videoshow');

/**
 * @param {string} keyword search query
 * @param {string} tag keyword with dash that replace space
 * @param {array} images array of image files in same resolution
 */
class VideoGenerator {
    constructor({ keyword, tag, images }) {
        this.keyword = keyword;
        this.tag     = tag;
        this.images  = images;
    }

    async create() {
        var videoOptions = {
            fps: 25,
            loop: 5, // seconds
            transition: true,
            transitionDuration: 1, // seconds
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: '1280x720',
            audioBitrate: '128k',
            audioChannels: 2,
            format: 'mp4',
            pixelFormat: 'yuv420p'
        }

        videoshow(this.images, videoOptions)
            .save(`./videos/${this.tag}.mp4`)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                console.error('Video created in:', output)
            })
    }
}

module.exports.VideoGenerator = VideoGenerator;