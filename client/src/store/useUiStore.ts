import { create } from 'zustand';
import type { FilterOption } from '../types/task';

interface UIStore {
    search: string;
    filter: FilterOption;
    page: number;
    setSearch: (search: string) => void;
    setFilter: (filter: FilterOption) => void;
    setPage: (page: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    search: '',
    filter: 'all',
    page: 1,
    setSearch: (search) => set({ search, page: 1 }),
    setFilter: (filter) => set({ filter, page: 1 }),
    setPage: (page) => set({ page }),
}));
