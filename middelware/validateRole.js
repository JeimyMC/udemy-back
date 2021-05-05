const { response } = require("express");

const validateAdminRole = (req, res = response, next) => {
  if (!req.userID) {
    return res.status(500).json({ msg: "Se quiere verificar el token" });
  }
  const { rol } = req.userID;
  if (rol !== "admin") {
    res.status(401).json({ msg: "No eres administrador" });
  }
  next();
};

const whatRole = (...roles) => {
  return (req, res = response, next) => {
    console.log(roles, req.userID.rol);
    if (!req.userID) {
      return res.status(500).json({ msg: "Se quiere verificar el token" });
    }
    if (!roles.includes(req.userID.rol)) {
      return res.status(401).json({ msg: "No tienes el rol adecuado" });
    }
    next();
  };
};

module.exports = { validateAdminRole, whatRole };
