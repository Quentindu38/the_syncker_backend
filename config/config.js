const config = {
  /**
   * this is the last destination directory of uploaded files
   * it could be any folder
   */
  syncedDir: "./sync",
  /**
   * this is used by multer to temporarily save to file in the request
   * no need to change cause once file will move to last sync directory
   */
  tmpFolder: "./upload",
};

module.exports = config;