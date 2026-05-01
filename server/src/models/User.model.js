import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "password is required"]
        },

        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member"
        }
    },
    {timestamps: true}
)

const User = mongoose.model('User', userSchema)

export default  User