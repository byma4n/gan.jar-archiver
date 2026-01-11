/**
 * Interface that all Archive Engines must implement.
 */
class EngineInterface {
    /**
     * Compress a source to a destination stream.
     * @param {string} sourcePath - Absolute path to source file or directory.
     * @param {string} outputPath - Absolute path to output file.
     * @param {WritableStream} [outputStream] - Optional stream to write to (if not writing to file directly).
     * @returns {Promise<void>}
     */
    async compress(sourcePath, outputPath, outputStream) {
        throw new Error('Method not implemented');
    }

    /**
     * Extract a source archive to a target directory.
     * @param {string} sourcePath - Absolute path to archive file.
     * @param {string} targetPath - Absolute path to destination directory.
     * @param {number} [startOffset=0] - Byte offset where the archive payload starts.
     * @returns {Promise<void>}
     */
    async extract(sourcePath, targetPath, startOffset) {
        throw new Error('Method not implemented');
    }
}

module.exports = EngineInterface;
