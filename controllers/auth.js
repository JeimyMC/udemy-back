const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { createToken } = require("../helpers/token");
const { googleVerify } = require("./../helpers/google-verify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "Los datos no son correctos" });
    }
    if (!user.status) {
      res.status(400).json({ msg: "Cuenta eliminada" });
    }
    const validatePass = bcrypt.compareSync(password, user.password);
    if (!validatePass) {
      res.status(400).json({ msg: "Datos erróneos" });
    }
    const token = await createToken(user.id);
    res.json({ msg: "login", data: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        img,
        rol: "user",
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    const token = await createToken(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = { login, googleSignin };
