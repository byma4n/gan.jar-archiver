const GJarHeader = require('./GJarHeader');
const ZipEngine = require('../engines/ZipEngine');
const path = require('path');

class EngineDispatcher {
    
    /**
     * Get the correct engine and operation parameters for a given file.
     * @param {string} filePath 
     * @returns {Promise<{engine: object, offset: number, isGjar: boolean}>}
     */
    static async getEngineForExtraction(filePath) {
        // 1. Try to read GJAR header
        try {
            const header = await GJarHeader.readHeader(filePath);
            
            if (header.isValid) {
                console.log(`Detected GJAR container. Engine Type: ${header.engineType}`);
                switch(header.engineType) {
                    case GJarHeader.TYPES.ZIP:
                        return { engine: ZipEngine, offset: header.payloadOffset, isGjar: true };
                    case GJarHeader.TYPES.TAR:
                        throw new Error('TAR Engine not implemented yet');
                    default:
                        throw new Error('Unknown Engine Type');
                }
            }
        } catch (e) {
            // Ignore header read errors, probably not a GJAR file or too short
        }

        // 2. Fallback: Extension based or Default
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.zip') {
             return { engine: ZipEngine, offset: 0, isGjar: false };
        }

        // Default to ZipEngine for now if unknown
        return { engine: ZipEngine, offset: 0, isGjar: false };
    }

    /**
     * Get engine for compression.
     * @param {string} format - Desired format (gjar, zip).
     * @returns {object}
     */
    static getEngineForCompression(format) {
        // Currently we primarily support ZIP engine wrapped in GJAR or raw ZIP
        return ZipEngine;
    }
}

module.exports = EngineDispatcher;
