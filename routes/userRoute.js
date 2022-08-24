const express = require('express')
const {
    registerUser,
    logout,
    loginUser,
    getUserDetails,
    getAllUser,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    deleteUser,
    getSingleUser,
    verifyUser,
    resendOtpUser,
    createUser,
    deleteUserAccount
} = require('../controllers/userController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

router.route("/auth/register").post(isAuthenticatedUser,registerUser)
router.route("/auth/verify").post(isAuthenticatedUser, verifyUser)
router.route("/auth/resend").post(isAuthenticatedUser, resendOtpUser)
router.route("/auth/login").post(loginUser)
router.route("/auth/logout").get(logout)
router.route("/auth/profile")
    .get(isAuthenticatedUser, authorizeRoles, getUserDetails)
    .put(isAuthenticatedUser, updateProfile)
router.route("/auth/change-password").put(isAuthenticatedUser,updatePassword)
router.route("/auth/forgot-password").post(isAuthenticatedUser,forgotPassword)
router.route("/auth/reset-password/:token").put(isAuthenticatedUser,resetPassword)
router.route("/auth/admin")
    .get(isAuthenticatedUser, getAllUser)
    .post(isAuthenticatedUser, createUser)
router.route("/auth/admin/:id")
    .get(isAuthenticatedUser,getSingleUser)
    .delete(isAuthenticatedUser, deleteUser)
router.route("/auth/admin/account/:id").delete(isAuthenticatedUser,deleteUserAccount)

module.exports = router