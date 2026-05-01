export const statusVariant = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress') return 'warning';
    if (status === 'To Do') return 'info';
    return 'neutral';
};
