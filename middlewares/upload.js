const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (__, ___, cb) {
    cb(null, path.join(__dirname, "../tmp"));
  },
  filename: function (__, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
