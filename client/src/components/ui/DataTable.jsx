import { cn } from '../../utils/cn';

export const DataTable = ({ columns, data, rowKey = '_id', emptyText = 'No records found', className }) => {
    const resolveKey = (row, index) => {
        if (typeof rowKey === 'function') return rowKey(row, index);
        return row[rowKey] || index;
    };

    return (
        <div className={cn('overflow-x-auto rounded-none border border-zinc-300 bg-white', className)}>
            <table className="min-w-full border-collapse text-sm">
                <thead className="bg-zinc-100">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    'border-b border-r border-zinc-300 px-3 py-2 text-left font-semibold text-zinc-900 last:border-r-0',
                                    column.headerClassName
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-3 py-8 text-center text-zinc-600">
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={resolveKey(row, index)} className="border-b border-zinc-200 transition-colors duration-200 hover:bg-zinc-50 last:border-b-0">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'border-r border-zinc-200 px-3 py-2 align-top text-zinc-900 last:border-r-0',
                                            column.cellClassName
                                        )}
                                    >
                                        {column.render ? column.render(row, index) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
