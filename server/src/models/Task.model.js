import mongoose from "mongoose";
import Project from "./Project.model.js";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: [true, "Task title is required"],
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Completed'],
            default: 'To Do'
        },

        dueDate: {
            type: Date,
            required: [true, 'Due date is required']
        },

        Project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {timestamps: true}
)

const Task = mongoose.model('Task', taskSchema)
export default Task