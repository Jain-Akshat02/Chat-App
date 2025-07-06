import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    profilePic: {
        type: String,
        required: false,
        default: ""
    }
}, {timestamps: true});

export const User = mongoose.model("User", UserSchema);
