const RefImageCategories = require("../models/RefImageCategories");

// Add RefImageCategory
const addRefImageCategory = async (req, res) => {
  const { categoryName, description } = req.body;

  // Check if tax with the same categoryName already exists
  const existingCateg = await RefImageCategories.findOne({
    $or: [{ categoryName: categoryName }],
  });
  if (existingCateg) {
    return res
      .status(400)
      .json({ error: "A RefImageCategory with the same name already exists" });
  }

  const category = await RefImageCategories.create({
    categoryName,
    description,
  });

  if (category) {
    res.status(200);
    res.json("RefImageCategory added");
  } else {
    res.status(400);
    res.json("Adding RefImageCategory failed");
  }
};

//Get All RefImageCategories
const getAllRefImageCategories = async (req, res) => {
  const abc = await RefImageCategories.find()
    .then((categ) => {
      res.json(categ);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a RefImageCategory
const getRefImageCategory = async (req, res) => {
  try {
    const categoryObject = await RefImageCategories.findById(req.params.id);

    if (!categoryObject) {
      return res.status(404).json({ error: "RefImageCategory not found" });
    }

    const { _id, categoryName, description } = categoryObject;

    res.status(200).json({
      _id,
      categoryName,
      description,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update RefImageCategory
const updateRefImageCategory = async (req, res) => {
  const { categoryName, description } = req.body;

  try {
    const categoryObject = await RefImageCategories.findById(req.params.id);

    if (!categoryObject) {
      return res.status(404).json({ error: "RefImageCategory not found" });
    }

    const updatedCategory = await RefImageCategories.findByIdAndUpdate(
      req.params.id,
      {
        categoryName,
        description,
      }
    );

    if (updatedCategory) {
      res.status(200).json("RefImageCategory updated");
    } else {
      res.status(400).json("Updating RefImageCategory failed");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete RefImageCategory
const deleteRefImageCategory = async (req, res) => {
  try {
    const categoryObject = await RefImageCategories.findById(req.params.id);

    if (!categoryObject) {
      return res.status(404).json({ error: "RefImageCategory not found" });
    }

    await RefImageCategories.findByIdAndDelete(req.params.id);

    res.status(200).json("RefImageCategory deleted");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addRefImageCategory,
  getAllRefImageCategories,
  getRefImageCategory,
  updateRefImageCategory,
  deleteRefImageCategory,
};