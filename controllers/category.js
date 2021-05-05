const { response } = require("express");
const Category = require("./../models/category");

const createCategory = async (req, res = response) => {
  try {
    const name = req.body.name.toUpperCase();

    const categoryID = await Category.findOne({ name });
    if (categoryID) {
      return res.status(400).json({
        msg: "La categoría ya existe",
      });
    }

    const data = {
      name,
      user: req.userID._id,
    };

    const category = new Category(data);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const getCategories = async (req, res) => {
  const { limit, of } = req.query;

  const resp = await Promise.all([
    Category.countDocuments({ status: true }),
    Category.find({ status: true })
      .populate("user", "name")
      .skip(Number(of))
      .limit(Number(limit)),
  ]);
  res.json({
    msg: "Categorías",
    total: resp[0],
    data: resp[1],
  });
};

const categoryByID = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.json(category);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.userID._id;
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const categoryDelete = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
  res.json(categoryDelete);
};

module.exports = {
  createCategory,
  getCategories,
  categoryByID,
  updateCategory,
  deleteCategory,
};
