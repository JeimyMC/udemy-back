const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit, of } = req.query;

  const resp = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true }).skip(Number(of)).limit(Number(limit)),
  ]);
  res.json({
    msg: "Usuarios registrados",
    total: resp[0],
    data: resp[1],
  });
};

const usersPost = async (req, res = response) => {
  const { name, email, password, rol } = req.body;

  const user = new User({ name, email, password, rol });

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);
  await user.save();
  res.json({
    msg: "Usuario creado",
    user,
  });
};

const usersPut = async (req, res = response) => {
  const userAuth = req.userID;
  console.log(userAuth._id);
  const { _id, password, google, email, ...rest } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync();
    rest.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(userAuth._id, rest);

  res.json({
    msg: "Datos actualizados",
    user,
  });
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false });
  const userAuth = req.userID;
  res.json({
    msg: "Eliminador",
    user,
    userAuth,
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
