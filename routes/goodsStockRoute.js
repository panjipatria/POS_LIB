const express = require('express')
const {
    createRawMaterial,
    getAllRawMaterial,
    getOneRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    createFinishedGoods,
    getAllFinishedGoods,
    getOneFinishedGoods,
    updateFinishedGoods,
    deleteFinishedGoods,
    createSupplier,
    getAllSupplier,
    getOneSupplier,
    updateSupplier,
    deleteSupplier,
    createGoodsStock,
    getAllGoodsStock,
    getOneGoodsStock,
    updateGoodsStock,
    deleteGoodsStock,
    createRecipe,
    getAllRecipe,
    getOneRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/goodsStockControllers')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/rawMaterial")
    .post(isAuthenticatedUser, createRawMaterial)
    .get(isAuthenticatedUser, getAllRawMaterial)
router.route("/rawMaterial/:id")
    .get(isAuthenticatedUser, getOneRawMaterial)
    .put(isAuthenticatedUser, updateRawMaterial)
    .delete(isAuthenticatedUser, deleteRawMaterial)
router.route("/finishedGoods")
    .post(isAuthenticatedUser, createFinishedGoods)
    .get(isAuthenticatedUser, getAllFinishedGoods)
router.route("/finishedGoods/:id")
    .get(isAuthenticatedUser, getOneFinishedGoods)
    .put(isAuthenticatedUser, updateFinishedGoods)
    .delete(isAuthenticatedUser, deleteFinishedGoods)
router.route("/supplier")
    .post(isAuthenticatedUser, createSupplier)
    .get(isAuthenticatedUser, getAllSupplier)
router.route("/supplier/:id")
    .get(isAuthenticatedUser, getOneSupplier)
    .put(isAuthenticatedUser, updateSupplier)
    .delete(isAuthenticatedUser, deleteSupplier)
router.route("/goodsStock")
    .post(isAuthenticatedUser, createGoodsStock)
    .get(isAuthenticatedUser, getAllGoodsStock)
router.route("/goodsStock/:id")
    .get(isAuthenticatedUser, getOneGoodsStock)
    .put(isAuthenticatedUser, updateGoodsStock)
    .delete(isAuthenticatedUser, deleteGoodsStock)
router.route("/recipe")
    .post(isAuthenticatedUser, createRecipe)
    .get(isAuthenticatedUser, getAllRecipe)
router.route("/recipe/:id")
    .get(isAuthenticatedUser, getOneRecipe)
    .put(isAuthenticatedUser, updateRecipe)
    .delete(isAuthenticatedUser, deleteRecipe)

module.exports = router