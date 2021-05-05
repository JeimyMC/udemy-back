const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateToken = async (req = request, res = response, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      return res.status(401).json({ msg: "No existe token" });
    }
    const { userID } = jwt.verify(token, process.env.JWT);
    const user = await User.findById(userID);
    if (!user) {
      return res.status(401).json({ msg: "el usuario no existe" });
    }
    if (!user.status) {
      return res.status(401).json({ msg: "cuenta eliminada" });
    }

    req.userID = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "token no válido" });
  }
};

module.exports = { validateToken };
