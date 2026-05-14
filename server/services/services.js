const chalk = require("chalk");
// const multer = require("multer");
// const fs = require("fs-extra");
class Services {
  // /**
  //  * deleteFile deletes file from server
  //  * @param filename the file name
  //  * @param category the file's category
  //  */
  // static async deleteFile(filename, dir) {
  // 	try {
  // 		let path = `${__dirname}/../../public/uploads/${dir}/${filename}`;
  // 		if (fs.existsSync(path)) fs.unlinkSync(path);
  // 	} catch (e) {
  // 		return;
  // 	}
  // }
  // static getMulterImageUploadConfig(path) {
  // 	return {
  // 		storage: multer.diskStorage({
  // 			destination: (req, file, callback) => {
  // 				fs.mkdirsSync(path);
  // 				callback(null, path);
  // 			},
  // 			filename: (req, file, cb) => {
  // 				const ext = file.mimetype.split("/")[1];
  // 				cb(null, Date.now() + "." + ext);
  // 			},
  // 		}),
  // 		fileFilter: (req, file, cb) => {
  // 			if (
  // 				file.mimetype === "image/png" ||
  // 				file.mimetype === "image/jpg" ||
  // 				file.mimetype === "image/jpeg"
  // 			) {
  // 				cb(null, true);
  // 			} else {
  // 				cb(null, false);
  // 			}
  // 		},
  // 	};
  // }
}

module.exports = Services;
