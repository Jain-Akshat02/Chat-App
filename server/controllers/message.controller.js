import Message from '../models/message.model.js';
import {User} from '../models/user.model.js'; 
import cloudinary from '../config/cloudinary.js'
import {getRecieverSocketId} from '../src/server.js'; // Adjust the import path as needed
import {io} from '../config/socket.js';
export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");

        res.status(200).json(
            {message:"Users fetched successfully", users:
            filteredUsers});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiver: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json({
            messages: messages
        });
    } catch (error) {
        console.log("Error fetching messages:", error);
        res.status(500).json({message: "Internal server error"}); 
    }
}
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            text,
            image: imageUrl,
            senderId,
            receiverId
        });
        await newMessage.save();
        const receiverSocketId = getRecieverSocketId(receiverId);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({message: "Internal server error"});
    }
}