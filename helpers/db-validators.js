const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");
const Product = require("../models/products");

const validate = async (rol) => {
  const existRol = await Role.findOne({ rol });
  if (!existRol) {
    throw new Error("El rol es necesario");
  }
};

const ifExistEmail = async (email) => {
  const existEmail = await User.findOne({ email });

  if (existEmail) {
    throw new Error("El email ya existe");
  }
};

const ifExistUserID = async (id) => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error("El ID no existe");
  }
};

const ifExistCategory = async (id) => {
  const existID = await Category.findById(id);
  if (!existID) {
    throw new Error("El id no existe");
  }
};

const ifExistProduct = async (id) => {
  const existID = await Product.findById(id);
  if (!existID) {
    throw new Error("El id no existe");
  }
};

const colectionValidated = (kind = "", colections = []) => {
  const validate = colections.includes(kind);
  if (!validate) {
    throw new Error("No es permitida");
  }
  return true;
};

module.exports = {
  validate,
  ifExistEmail,
  ifExistUserID,
  ifExistCategory,
  ifExistProduct,
  colectionValidated,
};
