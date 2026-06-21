import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateTask } from '../hooks/useTasks';
import { isAxiosError } from 'axios';

interface TaskFormProps {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

interface FormErrors {
    title?: string;
}

export default function TaskForm({ onSuccess, onError }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const { mutate: createTask, isPending } = useCreateTask();

    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!title.trim()) e.title = 'Title is required.';
        return e;
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (errors.title) {
            setErrors((prev) => {
                const nextErrors = { ...prev };
                delete nextErrors.title;
                return nextErrors;
            });
        }
    };

    const handleSubmit = () => {
        const e = validate();

        if (Object.keys(e).length) return setErrors(e);

        setErrors({});

        createTask(
            { title: title.trim(), description: description.trim() || null },
            {
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                    onSuccess?.('Task created successfully.');
                },
                onError: (err) => {
                    if (isAxiosError(err)) {
                        const status = err.response?.status;
                        const detail = err.response?.data?.detail;

                        if (status === 422) {
                            const message = Array.isArray(detail)
                                ? (detail[0]?.msg ?? 'Validation error.')
                                : 'Validation error.';
                            setErrors({ title: message });
                            return;
                        }

                        if (status === 400 || status === 409) {
                            const message =
                                typeof detail === 'string'
                                    ? detail
                                    : 'A task with this title already exists.';
                            setErrors({ title: message });
                            return;
                        }
                    }
                    onError?.('Something went wrong. Please try again.');
                },
            }
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide mb-4">
                Create a new task
            </h2>

            <div className="flex flex-col gap-3">
                {/* Title input */}
                <div>
                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className={`w-full px-4 py-2 rounded-md border text-sm text-gray-800 placeholder-gray-400
                            focus:outline-none focus:ring-2 transition-all
                            ${
                                errors.title
                                    ? 'border-red-400 focus:ring-red-500/20'
                                    : 'border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-400'
                            }`}
                    />
                    {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Description input */}
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 text-sm text-gray-800 placeholder-gray-400 resize-none
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />

                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="self-end flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium
                        hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <Plus size={15} />
                    )}
                    Add Task
                </button>
            </div>
        </div>
    );
}
