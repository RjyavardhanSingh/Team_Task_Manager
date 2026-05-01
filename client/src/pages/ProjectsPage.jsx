import { useEffect, useMemo, useRef, useState } from 'react';
import { projectApi } from '../api/project.api';
import { useAuthStore } from '../store/authStore';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { getErrorMessage } from '../utils/api';

const formatDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString();
};

const getOwnerLabel = (project, currentUser) => {
    if (!project?.owner) return 'N/A';
    if (typeof project.owner === 'string') {
        return project.owner === currentUser?._id ? 'You' : project.owner;
    }

    const displayName = project.owner?.name || 'N/A';
    return project.owner?._id === currentUser?._id ? `${displayName} (You)` : displayName;
};

const parseTeamMembers = (input) =>
    input
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

const ProjectsPage = () => {
    const user = useAuthStore((state) => state.user);

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [notice, setNotice] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        teamMembers: '',
    });
    const noticeTimeoutRef = useRef(null);

    const isAdmin = user?.role === 'Admin';

    const fetchProjects = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await projectApi.getProjects();
            setProjects(response?.data || []);
        } catch (apiError) {
            setError(getErrorMessage(apiError, 'Failed to load projects'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        projectApi.getProjects()
            .then((response) => {
                if (!isActive) return;
                setProjects(response?.data || []);
                setError('');
            })
            .catch((apiError) => {
                if (!isActive) return;
                setError(getErrorMessage(apiError, 'Failed to load projects'));
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
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

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            teamMembers: '',
        });
        setCreateError('');
        setCreateSuccess('');
    };

    const closeModal = () => {
        setIsCreateOpen(false);
        resetForm();
    };

    const showNotice = (message) => {
        setNotice(message);
        if (noticeTimeoutRef.current) {
            window.clearTimeout(noticeTimeoutRef.current);
        }
        noticeTimeoutRef.current = window.setTimeout(() => {
            setNotice('');
        }, 2500);
    };

    const handleCreateProject = async (event) => {
        event.preventDefault();
        setCreateError('');
        setIsCreating(true);

        const payload = {
            name: form.name.trim(),
        };

        if (form.description.trim()) {
            payload.description = form.description.trim();
        }

        const members = parseTeamMembers(form.teamMembers);
        if (members.length > 0) {
            payload.teamMembers = members;
        }

        try {
            await projectApi.createProject(payload);
            await fetchProjects();
            setCreateSuccess('Project created successfully.');
            showNotice('New project added to the list.');
            await new Promise((resolve) => setTimeout(resolve, 320));
            closeModal();
        } catch (apiError) {
            setCreateError(getErrorMessage(apiError, 'Failed to create project'));
        } finally {
            setIsCreating(false);
        }
    };

    const columns = useMemo(
        () => [
            {
                key: 'name',
                header: 'Project Name',
                render: (project) => <span className="font-medium">{project.name}</span>,
            },
            {
                key: 'description',
                header: 'Description',
                render: (project) => project.description || 'No description',
            },
            {
                key: 'owner',
                header: 'Owner',
                render: (project) => getOwnerLabel(project, user),
            },
            {
                key: 'members',
                header: 'Members',
                render: (project) => (
                    <Badge variant="info">
                        {Array.isArray(project.teamMembers) ? project.teamMembers.length : 0}
                    </Badge>
                ),
            },
            {
                key: 'createdAt',
                header: 'Created',
                render: (project) => formatDate(project.createdAt),
            },
        ],
        [user]
    );

    return (
        <section>
            <div className="surface-card mb-6 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Projects</h1>
                    <p className="mt-1 text-sm text-zinc-600">View project ownership, members, and scope.</p>
                </div>
                {isAdmin ? (
                    <Button type="button" onClick={() => setIsCreateOpen(true)}>
                        New Project
                    </Button>
                ) : (
                    <Badge variant="neutral">Admin Only Creation</Badge>
                )}
            </div>

            {notice ? (
                <div className="status-enter mb-4 border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">
                    {notice}
                </div>
            ) : null}

            {error ? <div className="status-enter mb-4 border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</div> : null}

            <DataTable
                columns={columns}
                data={projects}
                emptyText={isLoading ? 'Loading projects...' : 'No projects available'}
            />

            <Modal
                isOpen={isCreateOpen}
                onClose={closeModal}
                title="Create Project"
                description="Only Admin users can create projects. Team members are optional and can be comma-separated emails."
                footer={
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" form="create-project-form" isLoading={isCreating}>
                            Create
                        </Button>
                    </div>
                }
            >
                <form id="create-project-form" onSubmit={handleCreateProject} className="space-y-4">
                    {createError ? <p className="status-enter border border-zinc-300 bg-zinc-100 p-2 text-sm text-zinc-900">{createError}</p> : null}
                    {createSuccess ? <p className="status-enter border border-zinc-300 bg-zinc-50 p-2 text-sm text-zinc-900">{createSuccess}</p> : null}

                    <Input
                        label="Project Name"
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Q3 Engineering Launch"
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-900">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                            rows={4}
                            className="field-control w-full px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
                            placeholder="Project context, delivery scope, or notes"
                        />
                    </div>

                    <Input
                        label="Team Member Emails"
                        value={form.teamMembers}
                        onChange={(event) => setForm((prev) => ({ ...prev, teamMembers: event.target.value }))}
                        placeholder="alex@gmail.com, sam@company.com"
                    />
                </form>
            </Modal>
        </section>
    );
};

export default ProjectsPage;
