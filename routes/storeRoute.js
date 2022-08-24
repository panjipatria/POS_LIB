const express = require('express')
const {
    createStore,
    getAllStore,
    getOneStore,
    updateStore,
    deleteStore,
    addStoreSosmed,
    removeStoreSosmed,
    addBranch,
    removeBranch
} = require('../controllers/storeController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/store")
    .post(createStore)
    .get(isAuthenticatedUser, getAllStore)
router.route("/store/:id")
    .get(isAuthenticatedUser, getOneStore)
    .put(isAuthenticatedUser, updateStore)
    .delete(deleteStore)
router.route("/store/sosmed/:id")
    .put(isAuthenticatedUser, addStoreSosmed)
    .delete(isAuthenticatedUser, removeStoreSosmed)
router.route("/store/branch")
    .post(isAuthenticatedUser, addBranch)
router.route("/store/branch/:id")
    .delete(isAuthenticatedUser, removeBranch)

module.exports = router