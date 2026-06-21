import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../store/useUiStore';

interface PaginationProps {
    total: number;
    totalPages: number;
}

export default function Pagination({ total, totalPages }: PaginationProps) {
    const { page, setPage } = useUIStore();

    if (totalPages <= 1) return null;

    const from = total === 0 ? 0 : (page - 1) * 10 + 1;
    const to = Math.min(page * 10, total);

    return (
        <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-gray-400">
                Showing {from}-{to} of {total} tasks
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-8 h-8 rounded-lg text-xs font-medium transition-colors
                            ${
                                p === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
