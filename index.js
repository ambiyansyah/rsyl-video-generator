"use strict";

const Scraper    = require('./lib/google-images-scraper');
const Downloader = require('./handler/imageHandler');
const argv       = require('yargs').argv;
const UserAgent  = require('user-agents');

(async () => {
    switch (argv.type) {
        case 'image':
            const keyword    = argv.keyword.replace(/[^a-zA-Z ]/g, '').trim().replace(/\s\s+/g, ' ').toLowerCase();
            const keywordTag = keyword.replace(/\s+/g, '-');
            const userAgent  = new UserAgent();
            const google     = new Scraper.Google({
                keyword  : keyword,
                userAgent: userAgent.toString(),
                limit    : argv.limit,
                puppeteer: {
                    headless: true
                },
                advanced: {
                    imgType   : 'photo',   // options: clipart, face, lineart, news, photo
                    resolution: 'l',       // options: l(arge), m(edium), i(cons), etc.
                    color     : undefined  // options: color, gray, trans
                }
            });

            const results  = await google.start();
            const download = await Downloader.download({keyword, keywordTag, results, userAgent});
            console.log(download);
            
            break;
        case 'video':
            console.log('coming soon');

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

            break;
        default:
            console.log('please fill type');
            
            break;
    }
})();