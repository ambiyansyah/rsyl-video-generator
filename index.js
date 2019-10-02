"use strict";

const Scraper   = require('./lib/google-images-scraper');
const argv      = require('yargs').argv;
const UserAgent = require('user-agents');
const download  = require('image-downloader');
const fse       = require('fs-extra');
const videoshow = require('videoshow');
const sharp     = require('sharp');

let userAgent = new UserAgent();
let keyword   = argv.keyword.replace(/[^a-zA-Z ]/g, '').trim().replace(/\s\s+/g, ' ').toLowerCase();
let google    = new Scraper.Google({
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

const downloadImages = async (results) => {
    let dir            = `./images/${keyword.replace(/\s+/g, '-')}`;
    let downloadedFile = [];
    fse.ensureDirSync(dir)

    for (let result of results) {
        if (result.type) {
            let imgTitle    = result.title.replace(/[^a-zA-Z ]/g, '').trim().replace(/\s\s+/g, ' ');
            let imgAlt      = imgTitle.replace(/\s+/g, '-').toLowerCase();
            let imgFilename = imgAlt + '.' + result.type;

            const options = {
                url    : result.url,
                dest   : `${dir}/${imgFilename}`,
                headers: {
                    'User-Agent': userAgent.toString()
                },
                timeout: 1500
            }

            try {
                console.log(`download ${result.url}`);
                const { filename, image } = await download.image(options)
                const semiTransparentRedPng = await sharp(filename)
                    .resize(640)
                    .toBuffer();
                
                downloadedFile.push(semiTransparentRedPng)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return downloadedFile;
}

(async () => {
    const results  = await google.start(); // search image links
    const download = await downloadImages(results);  // start to download images
    console.log(download);

    // console.log('results', download.length);
})();