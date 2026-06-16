import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
    {
        username: 
        {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        avatar: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)


export const User = mongoose.model("User",userSchema);