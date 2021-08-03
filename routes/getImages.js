const router = require('express').Router();
const path = require("path");
const config = require('../config/config');
const fs = require("fs");
const mime = require("mime");
const syncedDir = config.syncedDir;

router.get("/", (req, res, next) => {
  const requestData = req.query;

  if(requestData.path) {
    requestData.path = "/"+requestData.path;
    requestData.path = requestData.path.replace(/(\/|\\){2,}/ig, "/");
  }
  
  
  const fullPath = path.normalize(syncedDir + requestData.path);
  if (fs.existsSync(fullPath)) {
    const fileStat = fs.statSync(fullPath);
    
    if(fileStat.isDirectory()) {
      const regex = /image/;
      const host = req.get('host')+req.baseUrl;
      const files = fs.readdirSync(fullPath).filter(found => {
        const xPath = path.join(fullPath, found);
        const stat = fs.statSync(xPath);
        // We ensure that it is a file and that it is an image.
        const isImageFile = stat.isFile() && regex.test(mime.getType(xPath));

        return isImageFile;
      });
      const responseData = [];

      const [topSku, sku, color] = requestData.path.split("/").filter(p => p!= "");

      files.forEach(file => {
        responseData.push({
          image: host+"?path="+path.join(requestData.path, file),
          sku: sku,
          color: color,
        });
      });

      return res.status(200).json(responseData);

    } else if(fileStat.isFile()) {
      return res.sendFile(path.resolve(fullPath));
    }

  } else {
    return res.status(500).json({message: "file not found"});
  }
});

module.exports = router;