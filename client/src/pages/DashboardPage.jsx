import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { getErrorMessage } from '../utils/api';
import { statusVariant } from '../utils/statusVariant';

const metricCards = [
    { key: 'total', label: 'Total Tasks' },
    { key: 'todo', label: 'To Do' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
];

const formatDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString();
};

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [metrics, setMetrics] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
    });
    const [overdueTasks, setOverdueTasks] = useState([]);

    useEffect(() => {
        let isActive = true;

        dashboardApi.getMetrics()
            .then((response) => {
                if (!isActive) return;
                setMetrics(response?.data?.metrics || {});
                setOverdueTasks(response?.data?.overdueTasks || []);
            })
            .catch((apiError) => {
                if (!isActive) return;
                setError(getErrorMessage(apiError, 'Failed to load dashboard'));
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

    const overdueColumns = [
        {
            key: 'title',
            header: 'Task',
        },
        {
            key: 'project',
            header: 'Project',
            render: (task) => task?.Project?.name || 'N/A',
        },
        {
            key: 'dueDate',
            header: 'Due Date',
            render: (task) => formatDate(task?.dueDate),
        },
        {
            key: 'status',
            header: 'Status',
            render: (task) => <Badge variant={statusVariant(task?.status)}>{task?.status || 'Unknown'}</Badge>,
        },
    ];

    return (
        <section>
            <div className="surface-card mb-6 p-4">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="mt-1 text-sm text-zinc-600">Overview of your current workload and overdue items.</p>
            </div>

            {error ? (
                <div className="status-enter mb-4 border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</div>
            ) : null}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                    <article key={card.key} className="surface-card p-4">
                        <p className="text-xs uppercase tracking-wide text-zinc-600">{card.label}</p>
                        <p className="mt-3 text-3xl font-semibold">{metrics?.[card.key] ?? 0}</p>
                    </article>
                ))}
            </div>

            <div className="surface-card p-4">
                <h2 className="text-lg font-semibold">Overdue Tasks</h2>
                <p className="mt-1 text-sm text-zinc-600">
                    Tasks past due date and not marked as completed.
                </p>

                <div className="mt-4">
                    <DataTable
                        columns={overdueColumns}
                        data={overdueTasks}
                        emptyText={isLoading ? 'Loading overdue tasks...' : 'No overdue tasks'}
                    />
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;
