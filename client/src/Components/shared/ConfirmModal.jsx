export const ConfirmModal = ({ message, subMessage, confirmLabel = 'Delete', onConfirm, onCancel }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(2px)',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '2rem',
                maxWidth: '380px',
                width: '90%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                animation: 'modalIn 0.2s ease',
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111', marginBottom: '0.4rem' }}>
                    {message}
                </h2>
                {subMessage && (
                    <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem' }}>
                        {subMessage}
                    </p>
                )}
                <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-danger" style={{ background: '#fff0f0' }} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};
