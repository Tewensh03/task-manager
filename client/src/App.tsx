import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toolbar from './components/ToolBar';
import Toast from './components/Toast';
import type { ToastState } from './types/task';

const queryClient = new QueryClient();

function App() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
        setToast({ message, type });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Task Manager
                        </h1>
                    </div>
                    <TaskForm
                        onSuccess={(msg) => showToast(msg, 'success')}
                        onError={(msg) => showToast(msg, 'error')}
                    />
                    <Toolbar />
                    <TaskList
                        onSuccess={(msg) => showToast(msg, 'success')}
                        onError={(msg) => showToast(msg, 'error')}
                    />
                </div>
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </QueryClientProvider>
    );
}

export default App;
