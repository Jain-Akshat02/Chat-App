import express from 'express'; 
import { verifyUser } from '../middlewares/verifyUser.middleware.js';
import { getUsers, getMessages, sendMessage } from '../../controllers/message.controller.js';                           

const router = express.Router();

router.get("/users", verifyUser,getUsers);
console.log('---errorB---');
router.get("/:id", verifyUser,getMessages);
console.log('---errorB---');
router.post("/send/:id", verifyUser, sendMessage);
console.log('---errorB---');
export default router