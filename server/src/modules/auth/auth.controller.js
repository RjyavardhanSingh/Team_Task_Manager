import { registerUser, loginUser } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.body.email, req.body.password);
    res.status(200).json(new ApiResponse(200, result, "User logged in successfully"));
});

export{
    register,
    login
}