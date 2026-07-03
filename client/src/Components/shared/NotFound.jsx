
import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div>
            <header>
                <Link to='/' className="brand">BITE<span>ROUTE</span></Link>
            </header>

            <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                <div style={{ fontSize: '5rem', fontWeight: 800, color: '#f0f0f0', lineHeight: 1 }}>404</div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                    Page not found
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '2rem' }}>
                    Looks like this page went out for delivery and never came back.
                </p>
                <Link to='/' className="browse-btn">Back to restaurants</Link>
            </div>
        </div>
    );
};
