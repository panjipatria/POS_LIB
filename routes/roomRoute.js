const express = require('express')
const {
    createRoom,
    getAllRoom,
    getOneRoom,
    updateRoom,
    deleteRoom,
    createTable,
    getAllTable,
    getOneTable,
    updateTable,
    deleteTable
} = require('../controllers/roomControllers')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/room")
    .post(isAuthenticatedUser, createRoom)
    .get(isAuthenticatedUser, getAllRoom)
router.route("/room/:id")
    .get(isAuthenticatedUser, getOneRoom)
    .put(isAuthenticatedUser, updateRoom)
    .delete(isAuthenticatedUser, deleteRoom)
router.route("/table")
    .post(isAuthenticatedUser, createTable)
    .get(isAuthenticatedUser, getAllTable)
router.route("/table/:id")
    .get(isAuthenticatedUser, getOneTable)
    .put(isAuthenticatedUser, updateTable)
    .delete(isAuthenticatedUser, deleteTable)

module.exports = router