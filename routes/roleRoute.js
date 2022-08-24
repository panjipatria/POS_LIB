const express = require('express')
const {
    createRole,
    addPermission,
    deletePermission,
    deleteRole,
    getAllRole,
    getOneRole
} = require('../controllers/roleController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/role")
    .post(isAuthenticatedUser,createRole)
    .get(isAuthenticatedUser,getAllRole)
router.route("/role/:id")
    .get(isAuthenticatedUser,getOneRole)
    .delete(isAuthenticatedUser,deleteRole)
router.route("/role/permission/:id")
    .put(isAuthenticatedUser,addPermission)
    .delete(isAuthenticatedUser,deletePermission)

module.exports = router