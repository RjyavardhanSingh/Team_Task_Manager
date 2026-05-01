import { useEffect, useMemo, useRef, useState } from 'react';
import { taskApi } from '../api/task.api';
import { projectApi } from '../api/project.api';
import { useAuthStore } from '../store/authStore';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getErrorMessage } from '../utils/api';
import { statusVariant } from '../utils/statusVariant';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

const formatDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString();
};

const assignedToLabel = (task, currentUserId) => {
    if (!task?.assignedTo) return 'Unassigned';
    if (typeof task.assignedTo === 'string') {
        if (task.assignedTo === currentUserId) return 'You';
        return 'Assigned User';
    }
    return task.assignedTo?.name || task.assignedTo?.email || 'Unassigned';
};

const TasksPage = () => {
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'Admin';

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const [tasks, setTasks] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [error, setError] = useState('');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState('');
    const [notice, setNotice] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
        project: '',
        assignedTo: '',
    });
    const noticeTimeoutRef = useRef(null);

    const fetchTasks = async (projectId) => {
        if (!projectId) {
            setTasks([]);
            return;
        }

        setIsLoadingTasks(true);
        setError('');

        try {
            const response = await taskApi.getProjectTasks(projectId);
            setTasks(response?.data || []);
        } catch (apiError) {
            setError(getErrorMessage(apiError, 'Failed to load tasks'));
        } finally {
            setIsLoadingTasks(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        projectApi.getProjects()
            .then(async (response) => {
                if (!isActive) return;

                const list = response?.data || [];
                setProjects(list);

                if (list.length === 0) {
                    setSelectedProjectId('');
                    setTasks([]);
                    return;
                }

                const projectId = list[0]._id;
                setSelectedProjectId(projectId);
                setIsLoadingTasks(true);

                try {
                    const tasksResponse = await taskApi.getProjectTasks(projectId);
                    if (!isActive) return;
                    setError('');
                    setTasks(tasksResponse?.data || []);
                } catch (apiError) {
                    if (!isActive) return;
                    setError(getErrorMessage(apiError, 'Failed to load tasks'));
                } finally {
                    if (isActive) {
                        setIsLoadingTasks(false);
                    }
                }
            })
            .catch((apiError) => {
                if (!isActive) return;
                setError(getErrorMessage(apiError, 'Failed to load projects for tasks'));
            })
            .finally(() => {
                if (isActive) {
                    setIsLoadingProjects(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (noticeTimeoutRef.current) {
                window.clearTimeout(noticeTimeoutRef.current);
            }
        };
    }, []);

    const showNotice = (message) => {
        setNotice(message);
        if (noticeTimeoutRef.current) {
            window.clearTimeout(noticeTimeoutRef.current);
        }
        noticeTimeoutRef.current = window.setTimeout(() => {
            setNotice('');
        }, 2400);
    };

    const handleProjectChange = async (event) => {
        const nextProjectId = event.target.value;
        setSelectedProjectId(nextProjectId);
        await fetchTasks(nextProjectId);
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            status: 'To Do',
            dueDate: '',
            project: selectedProjectId,
            assignedTo: '',
        });
        setCreateError('');
        setCreateSuccess('');
    };

    const openCreateModal = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        resetForm();
    };

    const handleCreateTask = async (event) => {
        event.preventDefault();
        setCreateError('');
        setIsCreating(true);

        const payload = {
            title: form.title.trim(),
            status: form.status,
            dueDate: form.dueDate,
            project: form.project,
        };

        if (form.description.trim()) {
            payload.description = form.description.trim();
        }

        if (isAdmin) {
            if (form.assignedTo.trim()) {
                payload.assignedTo = form.assignedTo.trim();
            }
        } else if (user?._id) {
            payload.assignedTo = user._id;
        }

        try {
            await taskApi.createTask(payload);
            if (selectedProjectId !== payload.project) {
                setSelectedProjectId(payload.project);
            }
            await fetchTasks(payload.project);
            setCreateSuccess('Task created successfully.');
            showNotice('Task has been added to the board.');
            await new Promise((resolve) => setTimeout(resolve, 320));
            closeCreateModal();
        } catch (apiError) {
            setCreateError(getErrorMessage(apiError, 'Failed to create task'));
        } finally {
            setIsCreating(false);
        }
    };

    const handleStatusUpdate = async (taskId, nextStatus) => {
        setUpdatingTaskId(taskId);
        try {
            const response = await taskApi.updateStatus(taskId, nextStatus);
            const updatedStatus = response?.data?.status || nextStatus;
            await new Promise((resolve) => setTimeout(resolve, 180));
            setTasks((prev) =>
                prev.map((task) =>
                    task._id === taskId
                        ? {
                            ...task,
                            status: updatedStatus,
                        }
                        : task
                )
            );
            showNotice(`Task moved to "${updatedStatus}".`);
        } catch (apiError) {
            setError(getErrorMessage(apiError, 'Failed to update task status'));
        } finally {
            setUpdatingTaskId('');
        }
    };

    const selectedProjectName = useMemo(
        () => projects.find((project) => project._id === selectedProjectId)?.name || 'Project',
        [projects, selectedProjectId]
    );

    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (task) => <span className="font-medium">{task.title}</span>,
        },
        {
            key: 'description',
            header: 'Description',
            render: (task) => task.description || 'No description',
        },
        {
            key: 'assignedTo',
            header: 'Assigned To',
            render: (task) => assignedToLabel(task, user?._id),
        },
        {
            key: 'dueDate',
            header: 'Due Date',
            render: (task) => formatDate(task.dueDate),
        },
        {
            key: 'status',
            header: 'Status',
            render: (task) => <Badge variant={statusVariant(task.status)}>{task.status}</Badge>,
        },
        {
            key: 'actions',
            header: 'Update Status',
            render: (task) => (
                <select
                    className="field-control h-9 w-full px-2 text-sm"
                    value={task.status}
                    onChange={(event) => handleStatusUpdate(task._id, event.target.value)}
                    disabled={updatingTaskId === task._id}
                >
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            ),
        },
    ];

    const noProjects = !isLoadingProjects && projects.length === 0;

    return (
        <section>
            <div className="surface-card mb-6 p-4">
                <h1 className="text-xl font-semibold">Tasks</h1>
                <p className="mt-1 text-sm text-zinc-600">
                    Create tasks, assign owners, and update status across your accessible projects.
                </p>
            </div>

            {notice ? (
                <div className="status-enter mb-4 border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">
                    {notice}
                </div>
            ) : null}

            {error ? <div className="status-enter mb-4 border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</div> : null}

            <div className="surface-card mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between">
                <div className="w-full max-w-sm">
                    <label className="mb-1 block text-sm font-medium text-zinc-900">Project</label>
                    <select
                        className="field-control h-10 w-full px-3 text-sm"
                        value={selectedProjectId}
                        onChange={handleProjectChange}
                        disabled={isLoadingProjects || noProjects}
                    >
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="button" onClick={openCreateModal} disabled={noProjects}>
                    New Task
                </Button>
            </div>

            {noProjects ? (
                <div className="surface-card p-4 text-sm text-zinc-600">
                    No projects available. Tasks can be created after at least one project exists.
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={tasks}
                    emptyText={isLoadingTasks ? `Loading tasks for ${selectedProjectName}...` : 'No tasks for this project'}
                />
            )}

            <Modal
                isOpen={isCreateOpen}
                onClose={closeCreateModal}
                title="Create Task"
                description={`Create a task under ${selectedProjectName}.`}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeCreateModal}>
                            Cancel
                        </Button>
                        <Button type="submit" form="create-task-form" isLoading={isCreating}>
                            Create
                        </Button>
                    </div>
                }
            >
                <form id="create-task-form" onSubmit={handleCreateTask} className="space-y-4">
                    {createError ? <p className="status-enter border border-zinc-300 bg-zinc-100 p-2 text-sm text-zinc-900">{createError}</p> : null}
                    {createSuccess ? <p className="status-enter border border-zinc-300 bg-zinc-50 p-2 text-sm text-zinc-900">{createSuccess}</p> : null}

                    <Input
                        label="Title"
                        value={form.title}
                        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="Implement audit logs"
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-900">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                            rows={4}
                            className="field-control w-full px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
                            placeholder="Detailed implementation notes"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-900">Due Date</label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                                className="field-control h-10 w-full px-3 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-900">Status</label>
                            <select
                                value={form.status}
                                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                                className="field-control h-10 w-full px-3 text-sm"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-900">Project</label>
                        <select
                            value={form.project}
                            onChange={(event) => setForm((prev) => ({ ...prev, project: event.target.value }))}
                            className="field-control h-10 w-full px-3 text-sm"
                            required
                        >
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isAdmin ? (
                        <Input
                            label="Assign To (User Email)"
                            value={form.assignedTo}
                            onChange={(event) => setForm((prev) => ({ ...prev, assignedTo: event.target.value }))}
                            placeholder="optional user email (example@gmail.com)"
                        />
                    ) : (
                        <div className="surface-card-muted text-zinc-700 p-2 text-xs">
                            Member mode: new tasks are auto-assigned to your user.
                        </div>
                    )}
                </form>
            </Modal>
        </section>
    );
};

export default TasksPage;
