const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

class ArchiverCore {
  /**
   * Create a zip archive from a source directory or file.
   * @param {string} sourcePath - Path to the source directory or file.
   * @param {string} outputPath - Path where the zip file will be saved.
   * @returns {Promise<void>}
   */
  static async compress(sourcePath, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });

      output.on("close", function () {
        console.log(archive.pointer() + " total bytes");
        console.log(
          "archiver has been finalized and the output file descriptor has closed."
        );
        resolve();
      });

      output.on("end", function () {
        console.log("Data has been drained");
      });

      archive.on("warning", function (err) {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          reject(err);
        }
      });

      archive.on("error", function (err) {
        reject(err);
      });

      archive.pipe(output);

      // Check if source is a directory or file
      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        if (stats.isDirectory()) {
          archive.directory(sourcePath, false);
        } else {
          archive.file(sourcePath, { name: path.basename(sourcePath) });
        }

        archive.finalize();
      });
    });
  }
}

module.exports = ArchiverCore;
