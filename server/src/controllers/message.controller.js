import Message from '../models/message.model.js';
import {User} from '../models/user.model.js'; 
import cloudinary from '../config/cloudinary.js'
import {getReceiverSocketId} from '../config/socket.js'; 
import {io} from '../config/socket.js';

export const testAuth = async (req, res) => {
    try {
        console.log("Test auth - Request user:", req.user);
        console.log("Test auth - Request cookies:", req.cookies);
        res.status(200).json({ message: "Auth working", user: req.user });
    } catch (error) {
        console.error("Test auth error:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getUsers = async (req, res) => {
    try {
        console.log("=== GET USERS ENDPOINT CALLED ===");
        console.log("Request user:", req.user);
        console.log("Request cookies:", req.cookies);
        
        const loggedInUser = req.user._id;
        console.log("Logged in user ID:", loggedInUser);
        
        // First, let's check if there are any users in the database
        const allUsers = await User.find({}).select("-password");
        console.log("All users in database:", allUsers);
        console.log("Total users count:", allUsers.length);
        
        // If no users exist, return empty array
        if (allUsers.length === 0) {
            console.log("No users found in database");
            return res.status(200).json({ users: [] });
        }
        
        // If only one user exists and it's the logged-in user, return empty array
        if (allUsers.length === 1 && allUsers[0]._id.toString() === loggedInUser.toString()) {
            console.log("Only logged-in user exists in database");
            return res.status(200).json({ users: [] });
        }
        
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        console.log("Filtered Users:", filteredUsers);
        console.log("Number of users found:", filteredUsers.length);
        console.log("---function called---");
        
        console.log("Sending response:", { users: filteredUsers });
        res.status(200).json({ users: filteredUsers });
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
                {senderId: myId, receiverId: userToChatId},
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
        const receiverSocketId = getReceiverSocketId(receiverId);
         if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({message: "Internal server error"});
    }
}