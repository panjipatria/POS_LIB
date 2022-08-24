const express = require('express')
const {
    createGoodsStockWarehouse,
    getAllGoodsStockWarehouse,
    getOneGoodsStockWarehouse,
    updateGoodsStockWarehouse,
    deleteGoodsStockWarehouse
} = require('../controllers/warehouseController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/warehouse")
    .post(isAuthenticatedUser, createGoodsStockWarehouse)
    .get(isAuthenticatedUser, getAllGoodsStockWarehouse)
router.route("/warehouse/:id")
    .get(isAuthenticatedUser, getOneGoodsStockWarehouse)
    .put(isAuthenticatedUser, updateGoodsStockWarehouse)
    .delete(isAuthenticatedUser, deleteGoodsStockWarehouse)

module.exports = router