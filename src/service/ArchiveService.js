const fs = require('fs-extra');
const EngineDispatcher = require('../core/container/EngineDispatcher');
const GJarHeader = require('../core/container/GJarHeader');

class ArchiveService {
    async compress(sourcePath, outputPath) {
        try {
            console.log(`Service: Compressing ${sourcePath} to ${outputPath}`);
            
            const isGjar = outputPath.toLowerCase().endsWith('.gjar');
            const Engine = EngineDispatcher.getEngineForCompression(isGjar ? 'gjar' : 'zip');

            if (isGjar) {
                // GJAR FLOW: Write Header -> Stream Archive
                const outputStream = fs.createWriteStream(outputPath);
                
                // 1. Write Header
                const header = GJarHeader.createHeader(GJarHeader.TYPES.ZIP);
                outputStream.write(header);

                // 2. Compress payload to the SAME stream
                // Note: We need to wait for the stream to handle the write before piping logic? 
                // Actually write() is sync-ish for buffers or handled by node.
                // We pass the stream to the engine.
                await Engine.compress(sourcePath, null, outputStream);
                
                // Close stream is handled by engine or us? 
                // ZipEngine logic: "archive.on('end', () => resolve())". 
                // But we piped archive -> outputStream.
                // We should close the outputStream when archive is done.
                // Let's ensure ZipEngine doesn't close it prematurely if we passed it in.
                
                // Fix: ZipEngine implementation resolved on 'end'.
                // We should probably wait for 'finish' on the write stream.
                return new Promise((resolve) => {
                     outputStream.on('finish', () => {
                        resolve({ success: true });
                     });
                     // ZipEngine finalized the archive, which ended the archive stream, which ended the output stream (pipe).
                });

            } else {
                // Standard ZIP Flow
                await Engine.compress(sourcePath, outputPath);
                return { success: true };
            }

        } catch (error) {
            console.error('Service Error (Compress):', error);
            return { success: false, error: error.message };
        }
    }

    async extract(sourcePath, targetPath) {
        try {
            console.log(`Service: Extracting ${sourcePath} to ${targetPath}`);
            const { engine, offset } = await EngineDispatcher.getEngineForExtraction(sourcePath);
            
            await engine.extract(sourcePath, targetPath, offset);
            return { success: true };
        } catch (error) {
            console.error('Service Error (Extract):', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ArchiveService();
