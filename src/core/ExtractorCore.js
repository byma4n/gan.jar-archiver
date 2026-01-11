const extract = require('extract-zip');
const path = require('path');
const fs = require('fs-extra');

class ExtractorCore {
    /**
     * Extract a zip archive to a target directory.
     * @param {string} sourcePath - Path to the zip file.
     * @param {string} targetPath - Path where the files will be extracted.
     * @returns {Promise<void>}
     */
    static async extract(sourcePath, targetPath) {
        try {
            // Ensure absolute path for target
            const absoluteTarget = path.resolve(targetPath);
            
            await extract(sourcePath, { dir: absoluteTarget });
            console.log('Extraction complete');
        } catch (err) {
            console.error('Extraction failed:', err);
            throw err;
        }
    }
}

module.exports = ExtractorCore;
