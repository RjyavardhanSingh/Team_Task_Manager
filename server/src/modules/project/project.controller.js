import { createProject, getUserProjects } from "./project.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const projectCreation = async(req, res, next) => {
    try {
        const project = await createProject(req.body, req.user._id)
        return res.status(201).json({
            success: true,
            data: project
        })
    } catch (error) {
        next(error)
    }
}

const getproject = asyncHandler(async (req, res) => {
    const projects = await getUserProjects(req.user._id, req.user.role);
    res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export{
    projectCreation,
    getproject
}