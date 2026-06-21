import { ClipboardList, Loader2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import Pagination from './Pagination';

interface TaskListProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export default function TaskList({ onSuccess, onError }: TaskListProps) {
    const { data, isLoading, isError } = useTasks();

    if (isLoading)
        return (
            <div className="flex justify-center py-16 text-gray-400">
                <Loader2 size={24} className="animate-spin" />
            </div>
        );

    if (isError)
        return (
            <div className="text-center py-16 text-sm text-red-400">
                Failed to load tasks. Check your connection and try again.
            </div>
        );

    if (!data?.tasks?.length)
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                <ClipboardList size={36} strokeWidth={1.5} />
                <p className="text-sm">No tasks found</p>
            </div>
        );

    return (
        <div className="flex flex-col gap-4">
            {data.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onSuccess={onSuccess} onError={onError} />
            ))}
            <Pagination total={data.total} totalPages={data.total_pages} />
        </div>
    );
}
