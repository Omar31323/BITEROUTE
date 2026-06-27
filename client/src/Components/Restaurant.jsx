
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
const BASE_URL = import.meta.env.VITE_API_URL;

export const Restaurant = ({ restaurant }) => {
    const { user } = useAuth();

    return (
        <div className="card">
            <div className="card-img-wrapper">
                <img
                    src={`${BASE_URL}${restaurant.image}`}
                    alt={restaurant.name}
                    className="card-img"
                />
            </div>
            <div className="card-body">
                <div className="card-meta">
                    <span className="badge badge-cuisine">{restaurant.cuisine}</span>
                    <span className="badge badge-time">{restaurant.prepTime}</span>
                </div>
                <h3 className="card-title">{restaurant.name}</h3>
                <p className="card-desc">{restaurant.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div className="card-info">
                        <span className="rating">⭐ {restaurant.rating}</span>
                        <span className="delivery">
                            {restaurant.deliveryFees > 0 ? `$${restaurant.deliveryFees.toFixed(2)} delivery` : 'Free delivery'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/restaurant/${restaurant._id}/menu`} className="view-btn">View menu</Link>
                        {user?.isAdmin && (
                            <Link to={`/restaurant/${restaurant._id}/manage`} className="manage-btn">Manage</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

