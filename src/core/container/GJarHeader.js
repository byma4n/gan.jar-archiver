const fs = require('fs-extra');

const MAGIC_BYTES = Buffer.from('GJAR'); // 4 bytes
const VERSION = 1; // 1 byte
const HEADER_SIZE = 6; // 4 Magic + 1 Version + 1 Type

const ENGINE_TYPES = {
    ZIP: 0,
    TAR: 1,
    SEVEN_ZIP: 2
};

class GJarHeader {
    static get TYPES() {
        return ENGINE_TYPES;
    }

    static get HEADER_SIZE() {
        return HEADER_SIZE;
    }

    /**
     * Create a buffer containing the GJAR header.
     * @param {number} engineType - The type of engine used (0=ZIP, 1=TAR, etc).
     * @returns {Buffer}
     */
    static createHeader(engineType) {
        const buffer = Buffer.alloc(HEADER_SIZE);
        MAGIC_BYTES.copy(buffer, 0);
        buffer.writeUInt8(VERSION, 4);
        buffer.writeUInt8(engineType, 5);
        return buffer;
    }

    /**
     * Read the header from a file and determine the engine type.
     * @param {string} filePath 
     * @returns {Promise<{isValid: boolean, engineType: number, payloadOffset: number}>}
     */
    static async readHeader(filePath) {
        const handle = await fs.open(filePath, 'r');
        const buffer = Buffer.alloc(HEADER_SIZE);
        
        try {
            await fs.read(handle, buffer, 0, HEADER_SIZE, 0);
        } finally {
            await fs.close(handle);
        }

        // Check Magic
        if (!buffer.slice(0, 4).equals(MAGIC_BYTES)) {
            // Not a GJAR file, maybe a plain ZIP?
            return { isValid: false, engineType: null, payloadOffset: 0 };
        }

        // Check Version (For now just accepts 1)
        const version = buffer.readUInt8(4);
        if (version !== 1) {
             throw new Error(`Unsupported GJAR version: ${version}`);
        }

        const engineType = buffer.readUInt8(5);
        
        return {
            isValid: true,
            engineType: engineType,
            payloadOffset: HEADER_SIZE
        };
    }
}

module.exports = GJarHeader;
