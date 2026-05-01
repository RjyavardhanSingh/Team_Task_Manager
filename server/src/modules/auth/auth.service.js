import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/User.model.js'
import { ApiError } from '../../utils/ApiError.js'

const generateToken = (userId) => {
    return jwt.sign({sub: userId}, process.env.JWT_SECRET)
}

const registerUser = async(data) => {
    const existingUser = await User.findOne({email:data.email})

    if(existingUser){
        throw new ApiError(409, "Email is already registered");
    }
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    })

    const token = generateToken(user._id)

    user.password = undefined

    return {user, token}
}

const loginUser = async(email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(user._id)
    user.password = undefined

    return {user, token}
}

export{
    registerUser,
    loginUser
}