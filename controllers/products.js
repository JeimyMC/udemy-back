const { response } = require("express");
const Product = require("./../models/products");

const createProduct = async (req, res = response) => {
  try {
    const { status, user, ...body } = req.body;
    const name = req.body.name.toUpperCase();

    const productID = await Product.findOne({ name });
    if (productID) {
      return res.status(400).json({
        msg: "La categoría ya existe",
      });
    }

    const data = {
      ...body,
      name,
      user: req.userID._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const getProducts = async (req, res) => {
  const { limit, of } = req.query;

  const resp = await Promise.all([
    Product.countDocuments({ status: true }),
    Product.find({ status: true })
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(of))
      .limit(Number(limit)),
  ]);
  res.json({
    msg: "Productos",
    total: resp[0],
    data: resp[1],
  });
};

const productsByID = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  res.json(product);
};

const updateProducts = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.userID._id;
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productDelete = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(productDelete);
};

module.exports = {
  createProduct,
  getProducts,
  productsByID,
  updateProducts,
  deleteProduct,
};
