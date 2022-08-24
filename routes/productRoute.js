const express = require('express')
const {
    createCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    getAllProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    addFirstSubCategory,
    removeFirstSubCategory,
    addSecondSubCategory,
    removeSecondSubCategory,
    createAutoPromo,
    getAllAutoPromo,
    getOneAutoPromo,
    updateAutoPromo
} = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/category")
    .post(isAuthenticatedUser, createCategory)
    .get(isAuthenticatedUser, getAllCategories)
router.route("/category/:id")
    .get(isAuthenticatedUser, getOneCategory)
    .put(isAuthenticatedUser, updateCategory)
    .delete(isAuthenticatedUser, deleteCategory)
router.route("/category/subcategory/first/:id")
    .put(isAuthenticatedUser, addFirstSubCategory)
    .delete(isAuthenticatedUser, removeFirstSubCategory)
router.route("/category/subcategory/second/:id")
    .put(isAuthenticatedUser, addSecondSubCategory)
    .delete(isAuthenticatedUser, removeSecondSubCategory)
router.route('/product')
    .post(isAuthenticatedUser, createProduct)
    .get(isAuthenticatedUser, getAllProduct)
router.route('/product/:id')
    .get(isAuthenticatedUser, getOneProduct)
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct)
router.route('/autopromo')
    .post(isAuthenticatedUser, createAutoPromo)
    .get(isAuthenticatedUser, getAllAutoPromo)
router.route('/autopromo/:id')
    .get(isAuthenticatedUser, getOneAutoPromo)
    .put(isAuthenticatedUser, updateAutoPromo)

module.exports = router