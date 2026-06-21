import axios from 'axios';
import type {
    Task,
    TaskCreatePayload,
    TaskUpdatePayload,
    FilterOption,
    PaginatedResponse,
} from '../types/task';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export const taskApi = {
    getAll: (
        search?: string,
        status?: FilterOption,
        page: number = 1,
        pageSize: number = 10
    ): Promise<PaginatedResponse> =>
        api
            .get('/tasks/', {
                params: {
                    ...(search && { search }),
                    ...(status && status !== 'all' && { status }),
                    page,
                    page_size: pageSize,
                },
            })
            .then((r) => r.data),

    create: (data: TaskCreatePayload): Promise<Task> =>
        api.post('/tasks/', data).then((r) => r.data),

    update: (id: number, data: TaskUpdatePayload): Promise<Task> =>
        api
            .patch(`/tasks/${id}`, data, {
                transformRequest: [(data) => JSON.stringify(data)],
                headers: { 'Content-Type': 'application/json' },
            })
            .then((r) => r.data),

    toggle: (id: number): Promise<Task> => api.patch(`/tasks/${id}/toggle`).then((r) => r.data),

    delete: (id: number): Promise<{ message: string }> =>
        api.delete(`/tasks/${id}`).then((r) => r.data),
};
