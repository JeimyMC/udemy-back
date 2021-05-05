const jwt = require("jsonwebtoken");

const createToken = (userID) => {
  return new Promise((resolve, reject) => {
    const payload = { userID };
    jwt.sign(payload, process.env.JWT, { expiresIn: "4h" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("No se pudo generar el token");
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = { createToken };
