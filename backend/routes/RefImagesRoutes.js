const router = require("express").Router();

const {
    addRefImage,
    getAllRefImages,
    getRefImage,
    updateRefImage,
    deleteRefImage,
} = require("../controllers/RefImagesController");

//ADD NEW  RefImage
router.post("/addRefImage", addRefImage);

//GET ALL  RefImages
router.get("/getAllRefImages", getAllRefImages);

//GET  RefImage
router.get("/getRefImage/:id", getRefImage);

//UPDATE  RefImage
router.put("/updateRefImage/:id", updateRefImage);

//DELETE  RefImage
router.delete("/deleteRefImage/:id", deleteRefImage);

module.exports = router;