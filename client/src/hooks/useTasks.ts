import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { useUIStore } from '../store/useUiStore';
import type { TaskCreatePayload, TaskUpdatePayload } from '../types/task';

const PAGE_SIZE = 10;

export const useTasks = () => {
    const { search, filter, page } = useUIStore();
    return useQuery({
        queryKey: ['tasks', search, filter, page],
        queryFn: () => taskApi.getAll(search, filter, page, PAGE_SIZE),
    });
};

export const useCreateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: TaskCreatePayload) => taskApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useUpdateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TaskUpdatePayload }) =>
            taskApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useToggleTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => taskApi.toggle(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};

export const useDeleteTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => taskApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};
