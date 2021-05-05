const User = require("./../models/user");
const Category = require("./../models/category");
const Product = require("./../models/products");
const { ObjectId } = require("mongoose").Types;

const collection = ["users", "category", "products"];

const findUsers = async (object, res) => {
  const isMongoID = ObjectId.isValid(object);
  if (isMongoID) {
    const user = await User.findById(object);
    res.json({ result: user ? user : [] });
  }
  const regex = new RegExp(object, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  res.json({ result: users });
};

const findCategory = async (object, res) => {
  const ifExist = ObjectId.isValid(object);
  if (ifExist) {
    const category = await Category.findById(object);
    res.json({ result: category ? category : [] }).populate("user", "name");
  }
  const regex = new RegExp(object, "i");
  const categories = await Category.find({
    name: regex,
    status: true,
  }).populate("user", "name");

  res.json({ result: categories });
};

const findProducts = async (object, res) => {
  const ifExist = ObjectId.isValid(object);
  if (ifExist) {
    const product = await Product.findById(object);
    res.json({ result: product ? product : [] });
  }
  const regex = new RegExp(object, "i");
  const products = await Product.find({ name: regex, status: true }).populate(
    "category",
    "name"
  );
  res.json({
    result: products,
  });
};

const seeker = (req, res) => {
  const { kind, object } = req.params;
  if (!collection.includes(kind)) {
    return res.status(400).json({ msg: "El tipo de búsqueda no es válido" });
  }

  switch (kind) {
    case "users":
      findUsers(object, res);
      break;
    case "category":
      findCategory(object, res);
      break;
    case "products":
      findProducts(object, res);
      break;

    default:
      res.status(500).json({ msg: "Se le olvido hacer esta búsqueda" });
  }
};

module.exports = { seeker };
