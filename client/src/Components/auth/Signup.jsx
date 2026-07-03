
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';

export const Signup = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const entries = Object.fromEntries(formData);
        try {
            const { data, ok } = await apiFetch('/signup', { method: 'POST', body: entries });
            if (ok) {
                navigate('/login');
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
                <div className="page-title">Create an account</div>
                <div className="page-sub">Join BiteRoute and start ordering.</div>

                {errorMessage && (
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <p className="error-msg">⚠️ {errorMessage}</p>
                    </div>
                )}

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="grid">
                                <div className="field">
                                    <label htmlFor="firstname">First name</label>
                                    <input id="firstname" type="text" name="firstname" placeholder="Jane" minLength="2" maxLength="50" required />
                                </div>
                                <div className="field">
                                    <label htmlFor="lastname">Last name</label>
                                    <input id="lastname" type="text" name="lastname" placeholder="Doe" minLength="2" maxLength="50" required />
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" name="email" placeholder="you@example.com" required />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" name="password" placeholder="••••••" minLength="6" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>

                <Link to='/login' id="question">Already have an account? Log in</Link>
            </div>
        </div>
    );
};
