const RefImages = require("../models/RefImages.model");

// Add RefImage
const addRefImage = async (req, res) => {
  const { imageURL, category} = req.body;

  // Check if tax with the same image already exists
  const existingURL = await RefImages.findOne({
    $or: [{ imageURL: imageURL }],
  });
  if (existingURL) {
    return res
      .status(400)
      .json({ error: "A image with the same URL already exists" });
  }

  const url = await RefImages.create({
    imageURL,
    category,
  });

  if (url) {
    res.status(200);
    res.json("Image added");
  } else {
    res.status(400);
    res.json("Adding Image failed");
  }
};

//Get All RefImages
const getAllRefImages = async (req, res) => {
  const abc = await RefImages.find()
    .then((url) => {
      res.json(url);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a RefImage
const getRefImage= async (req, res) => {
  try {
    const imageObject = await RefImages.findById(req.params.id);

    if (!imageObject) {
      return res.status(404).json({ error: "RefImage not found" });
    }

    const { _id, imageURL, category } = imageObject;

    res.status(200).json({
      _id,
      imageURL,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update RefImage
const updateRefImage = async (req, res) => {
  const { imageURL, category } = req.body;

  try {
    const imageObject = await RefImages.findById(req.params.id);

    if (!imageObject) {
      return res.status(404).json({ error: "RefImage not found" });
    }

    const updatedImage = await RefImages.findByIdAndUpdate(
      req.params.id,
      {
        imageURL,
        category,
      },
      { new: true }
    );

    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete RefImage
const deleteRefImage = async (req, res) => {
  try {
    const imageObject = await RefImages.findById(req.params.id);

    if (!imageObject) {
      return res.status(404).json({ error: "RefImage not found" });
    }

    await RefImages.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "RefImage deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addRefImage,
  getAllRefImages,
  getRefImage,
  updateRefImage,
  deleteRefImage,
};