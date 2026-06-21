export type TaskStatus = 'active' | 'completed';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse {
    tasks: Task[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface TaskCreatePayload {
    title: string;
    description?: string | null;
}

export interface TaskUpdatePayload {
    title?: string;
    description?: string | null;
}

export type FilterOption = 'all' | 'active' | 'completed';

export type ToastType = 'success' | 'error';

export interface ToastState {
    message: string;
    type: ToastType;
}
