import Task from "../../models/Task.model.js";
import Project from "../../models/Project.model.js";
import User from "../../models/User.model.js";
import { ApiError } from "../../utils/ApiError.js";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const resolveAssignee = async (assignedTo) => {
    if (!assignedTo) return null;

    const identifier = assignedTo.trim();
    if (!identifier) return null;

    if (objectIdPattern.test(identifier)) {
        const user = await User.findById(identifier).select('_id');
        if (!user) {
            throw new ApiError(400, `Assignee user not found: ${identifier}`);
        }
        return user._id;
    }

    const user = await User.findOne({ email: identifier.toLowerCase() }).select('_id');
    if (!user) {
        throw new ApiError(400, `Assignee email not found: ${identifier}`);
    }
    return user._id;
};

const createTask = async (taskData) => {
    const projectExists = await Project.findById(taskData.project)

    if(!projectExists){
         throw new ApiError(404, "Project not found");
    }

    const assigneeId = await resolveAssignee(taskData.assignedTo);

    const task = await Task.create({
        ...taskData,
        Project: taskData.project,
        assignedTo: assigneeId,
    })

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('Project', 'name');

    return populatedTask
}

const updateTaskStatus = async (taskId, status) => {
    const task = await Task.findByIdAndUpdate(
        taskId,
        {status},
        {new: true, runValidators: true}
    ).populate('assignedTo', 'name email')
        .populate('Project', 'name');

    if(!task){
        throw new ApiError(404, "Task not found");
    }

    return task
}

const getTasksByProject = async (projectId) => {
    return await Task.find({ Project: projectId }).populate('assignedTo', 'name email');
};

export {
    createTask,
    updateTaskStatus,
    getTasksByProject,
}
