import Task from '../../models/Task.model.js';

const getDashboardMetrics = async (userId, role) => {
    // If Member, only look at tasks assigned to them. If Admin, look at all tasks.
    const query = role === 'Admin' ? {} : { assignedTo: userId };

    const totalTasks = await Task.countDocuments(query);
    const todoTasks = await Task.countDocuments({ ...query, status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'In Progress' });
    const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });

    const overdueTasks = await Task.find({
        ...query,
        dueDate: { $lt: new Date() },
        status: { $ne: 'Completed' } // Not completed, but past due
    }).populate('Project', 'name');

    return {
        metrics: {
            total: totalTasks,
            todo: todoTasks,
            inProgress: inProgressTasks,
            completed: completedTasks
        },
        overdueTasks
    };
};

export {
    getDashboardMetrics
}