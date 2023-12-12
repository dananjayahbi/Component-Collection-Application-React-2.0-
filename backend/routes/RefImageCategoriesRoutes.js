const router = require('express').Router();

const {
    addRefImageCategory,
    getAllRefImageCategories,
    getRefImageCategory,
    updateRefImageCategory,
    deleteRefImageCategory,
    } = require('../controllers/RefImageCategoriesController');

//ADD NEW  RefImageCategory
router.post('/addRefImageCategory', addRefImageCategory);

//GET ALL  RefImageCategories
router.get('/getAllRefImageCategories', getAllRefImageCategories);

//GET  RefImageCategory
router.get('/getRefImageCategory/:id', getRefImageCategory);

//UPDATE  RefImageCategory
router.put('/updateRefImageCategory/:id', updateRefImageCategory);

//DELETE  RefImageCategory
router.delete('/deleteRefImageCategory/:id', deleteRefImageCategory);

module.exports = router;