const path = require("path");
const { v4: uuidv4 } = require("uuid");

const upFile = (
  files,
  validateExtension = ["png", "jpg", "jpeg", "gif"],
  direction = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const cutName = archivo.name.split(".");

    const extension = cutName[cutName.length - 1];

    if (!validateExtension.includes(extension)) {
      return reject("extensión errónea");
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", direction, tempName);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = { upFile };
