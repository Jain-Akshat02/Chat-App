import express from 'express'
import {signup,logout,login,updateProfilePicture,checkAuth} from '../controllers/auth.controller.js';
import {verifyUser} from '../middlewares/verifyUser.middleware.js';

const router = express.Router();

router.post('/signup',signup);
console.log('---errorA---');

router.post('/login', login)
console.log('---errorA---');
router.post('/logout', logout)
console.log('---errorA---');
router.put('/update-profile', verifyUser, updateProfilePicture)
console.log('---errorA---');
router.get('/check', verifyUser, checkAuth)     
console.log('---errorA---');             

export default router;