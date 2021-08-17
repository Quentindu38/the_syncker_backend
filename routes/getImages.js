const router = require('express').Router();
const path = require("path");
const config = require('../config/config');
const fs = require("fs");
const mime = require("mime");
const syncedDir = config.syncedDir.replace(/\\/gi, "/");

router.get("/", (req, res, next) => {
  const requestData = req.query;


  /**
   * stream a file if exists
   * used to sync missing file in local folder
   * couldn't be used in combination with req.sku
   */
  if(requestData.path) {
    const fullPath = path.normalize(syncedDir + requestData.path);
    if(fs.existsSync(fullPath)) {
      const fileStat = fs.statSync(fullPath);
      if(fileStat.isFile()) {
        return res.sendFile(path.resolve(fullPath));
      }
    }
    return res.status(404).json({message: "file not found"});
  }

  const sku = requestData.sku;
  const host = req.protocol+"://"+req.get('host');

  if(!sku) return res.status(400).json({message: "SKU parameter not found"});
  const topCategory = sku.split('-')[0];
  const color = requestData.color;

  console.log(topCategory);
  console.log(sku);
  console.log(color);
  const responseData = [];

  const skuRelativePath = `/${topCategory}/${sku}`;
  if(color) {
    const basePath = skuRelativePath + `/${color}`;
    const fullPath = path.normalize(syncedDir + basePath);
    const images = getImagesInColorFolder(basePath, fullPath, sku, color, host);
    if(images) {
      responseData.push(...images);
    }
  }
  else {
    const skuFullPath = path.normalize(syncedDir + skuRelativePath);
    if (fs.existsSync(skuFullPath)) {
      const colors = fs.readdirSync(skuFullPath);

      colors.filter(color => {
        const basePath = `${skuRelativePath}/${color}`;
        const fullPath = path.normalize(syncedDir + basePath);
        const images = getImagesInColorFolder(basePath, fullPath, sku, color, host);
        if(images) {
          responseData.push(...images);
        }
      });

    }
  }
  return res.status(200).json(responseData);
});

function getImagesInColorFolder(colorRelativePath, fullPath, sku, color, host) {
  if (fs.existsSync(fullPath)) {
    const fileStat = fs.statSync(fullPath);
    
    if(fileStat.isDirectory()) {
      const regex = /image/;

      const files = fs.readdirSync(fullPath).filter(found => {
        const xPath = path.join(fullPath, found);
        const stat = fs.statSync(xPath);
        // We ensure that it is a file and that it is an image.
        const isImageFile = stat.isFile() && regex.test(mime.getType(xPath));

        return isImageFile;
      });

      const responseData = [];

      files.forEach(file => {
        const imageUrl = (host+path.join(colorRelativePath, file)).replace(/\s/gi, "%20").replace(/\\/gi, "/");
        responseData.push({
          image: imageUrl,
          sku: sku.toUpperCase(),
          color: color.toUpperCase(),
          coverFlg: /cover/.test(file),
        });
      });

      return responseData;
    }
  }
  return null;
}

module.exports = router;