import { createTask, updateTaskStatus, getTasksByProject } from "./task.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const createNewTask = asyncHandler(async (req, res) => {
    const task = await createTask(req.body);
    res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

const updateStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    
    const updatedTask = await updateTaskStatus(taskId, status);
    res.status(200).json(new ApiResponse(200, updatedTask, "Task status updated successfully"));
});


const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const tasks = await getTasksByProject(projectId);
    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

export{
    createNewTask,
    updateStatus,
    getProjectTasks
}