const fs = require("fs");
const path = require("path");
const Product = require("../models/products");
const { upFile } = require("./../helpers/uploads");
const User = require("./../models/user");

const uploadsFile = async (req, res) => {
  try {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      res.status(400).send("No files were uploaded.");
      return;
    }
    const name = await upFile(req.files, ["txt", "md"]);

    res.json({ msg: "se subió la imagen", name });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "MALLL" });
  }
};

const updateImg = async (req, res) => {
  try {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.archivo
    ) {
      res.status(400).send("No files were uploaded.");
      return;
    }
    const { id, colection } = req.params;

    let model;

    switch (colection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: "No esxiste el usuario con ese id" });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res
            .status(400)
            .json({ msg: "No esxiste el producto con ese id" });
        }
        break;
      default:
        return res.status(500).json({ msg: "se olvidó de validar esto" });
    }

    if (model.img) {
      const pathImg = path.join(__dirname, "../uploads", colection, model.img);
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
      }
    }

    const picture = await upFile(req.files, undefined, colection);

    model.img = picture;

    await model.save();

    res.json(model);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Extensión errónea" });
  }
};

const showImg = async (req, res) => {
  try {
    const { id, colection } = req.params;

    let model;

    switch (colection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res.status(200).json({ msg: "El usuario no tiene imagen" });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res.status(200).json({ msg: "El producto no tiene imagen" });
        }
        break;
      default:
        return res.status(500).json({ msg: "se olvidó de validar esto" });
    }

    if (model.img) {
      const pathImg = path.join(__dirname, "../uploads", colection, model.img);

      if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
      }
    }

    res.json({ msg: "No se encuentra la imagen" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Extensión errónea" });
  }
};

module.exports = { uploadsFile, updateImg, showImg };
