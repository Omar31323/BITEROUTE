
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';

export const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const entries = Object.fromEntries(formData);
        try {
            const { data, ok } = await apiFetch('/login', { method: 'POST', body: entries });
            if (ok) {
                setUser(data);
                navigate('/');
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    return (
        <div>
            <header>
                <Link to='/' className="brand">BITE<span>ROUTE</span></Link>
                <div className="header-right">
                    <Link to='/' className="back-btn">← Back to home</Link>
                </div>
            </header>

            <div className="page" style={{ maxWidth: '420px' }}>
                <div className="page-title">Welcome back</div>
                <div className="page-sub">Log in to your account to continue.</div>

                {errorMessage && (
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <p className="error-msg">⚠️ {errorMessage}</p>
                    </div>
                )}

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" name="email" placeholder="you@example.com" required />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" name="password" placeholder="••••••" minLength="6" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Log in
                            </button>
                        </div>
                    </form>
                </div>

                <Link to="/signup" id="question">Don't have an account? Sign up</Link>
            </div>
        </div>
    );
};
