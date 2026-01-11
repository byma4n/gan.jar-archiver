const fs = require('fs-extra');
const archiver = require('archiver');
const extract = require('extract-zip');
const path = require('path');
const EngineInterface = require('../interfaces/EngineInterface');

class ZipEngine extends EngineInterface {
    
    async compress(sourcePath, outputPath, outputStream = null) {
        return new Promise((resolve, reject) => {
            // If outputStream is provided, use it (for GJAR streaming)
            // Otherwise create a file stream
            let output;
            let closeOutput = false;

            if (outputStream) {
                output = outputStream;
            } else {
                output = fs.createWriteStream(outputPath);
                closeOutput = true;
            }

            const archive = archiver('zip', {
                zlib: { level: 9 }
            });

            // If we own the stream, we listen for close
            if (closeOutput) {
                output.on('close', () => resolve());
            } else {
                // If we pipe to an external stream, we just resolve when archive is finalized
                // But archiver.pipe() doesn't automatically close destination
                archive.on('end', () => resolve());
            }

            archive.on('error', (err) => reject(err));
            archive.pipe(output);

            fs.stat(sourcePath, (err, stats) => {
                if (err) return reject(err);

                if (stats.isDirectory()) {
                    archive.directory(sourcePath, false);
                } else {
                    archive.file(sourcePath, { name: path.basename(sourcePath) });
                }
                
                archive.finalize();
            });
        });
    }

    async extract(sourcePath, targetPath, startOffset = 0) {
        // extract-zip doesn't natively support offsets.
        // We need to handle this.
        // If offset > 0, we can copy the payload to a temp file or use a library that supports streams/offsets.
        // yauzl (used by extract-zip) supports lazy file reading, but extract-zip wraps it simply.
        
        try {
            const absoluteTarget = path.resolve(targetPath);

            if (startOffset === 0) {
                // Standard ZIP extraction
                await extract(sourcePath, { dir: absoluteTarget });
            } else {
                // Hybrid GJAR extraction
                // We need to "slice" the file effectively.
                // For efficiency, we might want to avoid copying the whole file.
                // But for now, to be safe and use existing tools, let's create a temporary slice.
                // A better approach in production would be using 'yauzl' directly with a custom FileReader.
                
                // TEMP SOLUTION: Copy payload to temp file
                const tempFile = sourcePath + '.temp.zip';
                
                /* 
                   OPTIMIZATION TODO: 
                   Use 'yauzl' directly which allows specifying start offset if we implement a custom RandomAccessReader.
                   For MVP, we will stream copy the payload to a temp file.
                */
               
                await this._sliceFile(sourcePath, tempFile, startOffset);
                
                try {
                    await extract(tempFile, { dir: absoluteTarget });
                } finally {
                    await fs.remove(tempFile);
                }
            }
            
            console.log('Extraction complete');
        } catch (err) {
            console.error('Extraction failed:', err);
            throw err;
        }
    }

    async _sliceFile(source, dest, offset) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(source, { start: offset });
            const writeStream = fs.createWriteStream(dest);
            
            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', resolve);
            
            readStream.pipe(writeStream);
        });
    }
}

module.exports = new ZipEngine();
