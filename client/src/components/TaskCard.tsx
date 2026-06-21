import { useState } from 'react';
import { Check, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useToggleTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import ConfirmModal from './ConfirmModal';
import type { Task } from '../types/task';

interface TaskCardProps {
    task: Task;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

interface ConfirmState {
    type: 'delete' | 'toggle' | 'update';
    message: string;
}

interface EditErrors {
    title?: string;
}

export default function TaskCard({ task, onSuccess, onError }: TaskCardProps) {
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description ?? '');
    const [editErrors, setEditErrors] = useState<EditErrors>({});
    const [confirm, setConfirm] = useState<ConfirmState | null>(null);

    const { mutate: toggle, isPending: toggling } = useToggleTask();
    const { mutate: update, isPending: updating } = useUpdateTask();
    const { mutate: deleteTask, isPending: deleting } = useDeleteTask();

    const isCompleted = task.status === 'completed';

    const handleToggle = () => {
        setConfirm({
            type: 'toggle',
            message: `Mark this task as ${isCompleted ? 'active' : 'completed'}?`,
        });
    };

    const handleDeleteClick = () => {
        setConfirm({ type: 'delete', message: `"${task.title}" will be permanently deleted.` });
    };

    const handleUpdateClick = () => {
        const e: EditErrors = {};

        if (!editTitle.trim()) e.title = 'Title is required.';
        else if (editTitle.trim().length < 3) e.title = 'Title must be at least 3 characters.';

        if (Object.keys(e).length) return setEditErrors(e);

        setEditErrors({});
        setConfirm({ type: 'update', message: `Save changes to "${task.title}"?` });
    };

    const handleConfirm = () => {
        if (confirm?.type === 'delete') {
            deleteTask(task.id, {
                onSuccess: () => onSuccess?.('Task deleted.'),
                onError: () => onError?.('Failed to delete task.'),
            });
        } else if (confirm?.type === 'toggle') {
            toggle(task.id, {
                onSuccess: () =>
                    onSuccess?.(`Task marked as ${isCompleted ? 'active' : 'completed'}.`),
                onError: () => onError?.('Failed to update status.'),
            });
        } else if (confirm?.type === 'update') {
            update(
                {
                    id: task.id,
                    data: {
                        title: editTitle.trim(),
                        description: editDesc.trim(),
                    },
                },
                {
                    onSuccess: () => {
                        setEditing(false);
                        onSuccess?.('Task updated.');
                    },
                    onError: (err) => {
                        if (isAxiosError(err)) {
                            const status = err.response?.status;
                            const detail = err.response?.data?.detail;

                            if (status === 422) {
                                const message = Array.isArray(detail)
                                    ? (detail[0]?.msg ?? 'Validation error.')
                                    : 'Validation error.';
                                setEditErrors({ title: message });
                                return;
                            }

                            if (status === 400 || status === 409) {
                                const message =
                                    typeof detail === 'string'
                                        ? detail
                                        : 'A task with this title already exists.';
                                setEditErrors({ title: message });
                                return;
                            }
                        }
                        onError?.('Failed to update task.');
                    },
                }
            );
        }
        setConfirm(null);
    };

    return (
        <>
            <div className="group bg-white rounded-lg border border-gray-200 transition-all duration-200 shadow-sm overflow-hidden">
                <div className="flex">
                    <div className="w-1 shrink-0 transition-colors duration-300" />
                    <div className="flex-1 p-4">
                        {editing ? (
                            <div className="flex flex-col gap-2">
                                {/* Edit title input */}
                                <div>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        placeholder="Task title"
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-md border text-sm text-gray-800
                                        focus:outline-none focus:ring-2 transition-all
                                        ${
                                            editErrors.title
                                                ? 'border-red-400 focus:ring-red-500/20'
                                                : 'border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-400'
                                        }`}
                                    />
                                    {editErrors.title && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {editErrors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Edit description input */}
                                <textarea
                                    value={editDesc}
                                    placeholder="Description (optional)"
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-800 resize-none
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                />

                                {/* Action buttons */}
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setEditErrors({});
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={13} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateClick}
                                        disabled={updating}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    >
                                        {updating ? (
                                            <Loader2 size={13} className="animate-spin" />
                                        ) : (
                                            <Save size={13} />
                                        )}
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3">
                                {/* Toggle status button */}
                                <button
                                    onClick={handleToggle}
                                    disabled={toggling}
                                    className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                                        ${
                                            isCompleted
                                                ? 'bg-green-400 border-green-400 text-white'
                                                : 'border-gray-300 hover:border-indigo-400'
                                        }`}
                                >
                                    {toggling ? (
                                        <Loader2 size={10} className="animate-spin text-gray-400" />
                                    ) : (
                                        isCompleted && <Check size={11} strokeWidth={3} />
                                    )}
                                </button>

                                {/* Title and Description */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-sm font-medium text-gray-900 truncate transition-all
                                        ${isCompleted ? 'line-through text-gray-400' : ''}`}
                                    >
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                {/* Action buttons and timestamp */}
                                <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-indigo-500 transition-colors"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={handleDeleteClick}
                                            disabled={deleting}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            {deleting ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-400 line-clamp-2 pr-2">
                                        {task.updated_at
                                            ? new Date(task.updated_at).toLocaleDateString()
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </>
    );
}
