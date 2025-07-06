import express from 'express'
import {signup,logout,login,updateProfilePicture,checkAuth} from '../controllers/auth.controller.js';
import {verifyUser} from '../middlewares/verifyUser.middleware.js';

const router = express.Router();

router.post("/signup",signup);

router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", verifyUser, updateProfilePicture);

router.get("/check", verifyUser, checkAuth);

export default router;