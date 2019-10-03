'use strict'

const download = require('image-downloader');
const fse      = require('fs-extra');
const sharp    = require('sharp');

class ImageHandler { 
    constructor({ keyword, keywordTag, results, userAgent }) { 
        this.keyword   = keyword;
        this.tag       = keywordTag;
        this.results   = results;
        this.userAgent = userAgent.toString();
    }

    async imageDownload() { 
        const dirRaw    = `./images/${this.tag}/raw`;
        const dirResize = `./images/${this.tag}/resize`;
        const dirVideo  = `./images/${this.tag}/video`;

        // create directory
        fse.ensureDirSync(dirRaw);
        fse.ensureDirSync(dirResize);
        fse.ensureDirSync(dirVideo);

        // start download image
        let downloadedFile = [];
        for (let result of results) {
            // check if result have file type or not
            if (result.type) {
                // remove special character and keep only aplha and numeric
                let imgTitle = result.title.replace(/[^a-zA-Z ]/g, '').trim().replace(/\s\s+/g, ' ');
                
                // replace space with dash in imgTitle
                let imgAlt = imgTitle.replace(/\s+/g, '-').toLowerCase();
                
                // create image filename
                let imgFilename = imgAlt + '.' + result.type;

                // create options before download image
                const options = {
                    url: result.url,
                    dest: `${dirRaw}/${imgFilename}`,
                    headers: {
                        'User-Agent': userAgent.toString()
                    },
                    timeout: 1500
                }

                try {
                    console.log(`download ${result.url}`);

                    // download image
                    const { filename } = await download.image(options)
                    const resizeImage = await this.imageResize(filename, downloadedFile);

                    const fileResize = `${dirResize}/${imgFilename}`;

                    try {
                        const resized = await sharp(filename).resize({ width: 1280, height: 720 }).toFile(fileResize);

                        if (resized.size) {
                            downloadedFile.push(fileResize);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }

        return downloadedFile;
    }

    async imageResize() { 

    }
}

module.exports.download = downloadImages;