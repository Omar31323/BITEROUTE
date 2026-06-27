import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'error') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    const toast = {
        error: (msg) => showToast(msg, 'error'),
        success: (msg) => showToast(msg, 'success'),
        info: (msg) => showToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const ICONS = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
};

const COLORS = {
    success: { bg: '#111', accent: '#22c55e' },
    error:   { bg: '#111', accent: '#ff4d4d' },
    info:    { bg: '#111', accent: '#ffa726' },
};

const ToastContainer = ({ toasts }) => {
    if (toasts.length === 0) return null;
    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            zIndex: 9999,
        }}>
            {toasts.map(t => (
                <div key={t.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: COLORS[t.type].bg,
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '0.7rem 1.1rem',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    fontFamily: 'Inter, Arial, sans-serif',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                    animation: 'toastIn 0.25s ease',
                    maxWidth: '320px',
                    borderLeft: `3px solid ${COLORS[t.type].accent}`,
                }}>
                    <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: COLORS[t.type].accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        color: '#fff',
                    }}>
                        {ICONS[t.type]}
                    </span>
                    {t.message}
                </div>
            ))}
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
