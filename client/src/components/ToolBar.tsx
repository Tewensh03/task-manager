import { Search } from 'lucide-react';
import { useUIStore } from '../store/useUiStore';
import type { FilterOption } from '../types/task';

const FILTERS: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Inactive' },
];

const STATUS_KEYWORDS: Record<string, FilterOption> = {
    active: 'active',
    inactive: 'completed',
    incomplete: 'completed',
    completed: 'completed',
};

export default function ToolBar() {
    const { search, filter, setSearch, setFilter } = useUIStore();

    const handleSearch = (value: string) => {
        setSearch(value);

        const keyword = value.trim().toLowerCase();
        const matchedStatus = STATUS_KEYWORDS[keyword];

        if (matchedStatus) {
            setFilter(matchedStatus);
        } else if (Object.keys(STATUS_KEYWORDS).some((k) => k.startsWith(keyword)) === false) {
            setFilter('all');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    maxLength={255}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                />
            </div>

            <div className="flex gap-2 bg-gray-100 rounded-md">
                {FILTERS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${
                            filter === value
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
