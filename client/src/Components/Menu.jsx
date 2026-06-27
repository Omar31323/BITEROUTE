
import { useEffect, useState } from "react";
import { MenuItem } from "./MenuItem";
import { useParams, Link, useNavigate } from 'react-router-dom'
import { RestaurantHero } from "./RestaurantHero";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';
import { Footer } from "./Footer";

export const Menu = () => {
    const [restaurant, setRestaurant] = useState({});
    const [groupedMenuItems, setGroupedMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { cartCount } = useCart();
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const getMenu = async () => {
            try {
                const { data, ok } = await apiFetch(`/restaurant/${id}/menu`);
                if (ok) {
                    setRestaurant(data.restaurant);
                    setGroupedMenuItems(data.groupedMenuItems);
                    setLoading(false);
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            } catch (error) {
                setLoading(false);
                toast.error('Could not reach the server. Check your connection.');
            }
        }
        getMenu();
    }, []);

    const hasMenuItems = Object.keys(groupedMenuItems).length > 0;

    return (
        <div>
            {/* Header */}
            <header>
                <Link to='/' className="brand">
                    BITE<span>ROUTE</span>
                </Link>
                <div className="header-right">
                    <span className="back-btn" onClick={() => navigate(-1)}>
                        ← Restaurants
                    </span>

                    {user?.isAdmin && (
                        <>
                            <Link to={`/restaurant/${restaurant._id}/addItems`} className="cart-btn">
                                + Add items
                            </Link>
                            <Link to={`/restaurant/${restaurant._id}/editItems`} className="cart-btn">
                                Edit menu
                            </Link>
                            <Link to={`/restaurant/${restaurant._id}/orders`} className="cart-btn">
                                Orders
                            </Link>
                        </>
                    )}

                    {!user?.isAdmin && (
                        <Link to="/cart" className="cart-btn">
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </Link>
                    )}
                </div>
            </header>

            {/* Restaurant hero */}
            {!loading && restaurant && <RestaurantHero restaurant={restaurant} />}

            {/* Menu layout */}
            {hasMenuItems ? (
                <div className="layout">
                    <div className="sidebar">
                        <h3>Menu</h3>
                        {!loading && Object.keys(groupedMenuItems).map((key) => (
                            <a key={key} href={`#${key}`}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </a>
                        ))}
                    </div>

                    <div className="menu-content">
                        {Object.keys(groupedMenuItems).map((key) => (
                            <div key={key} className="menu-section" id={key}>
                                <h2>{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                                <div className="menu-grid">
                                    {groupedMenuItems[key].map((menuItem) => (
                                        <MenuItem key={menuItem._id} menuItem={menuItem} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="empty-state" style={{ marginTop: '4rem' }}>
                    <div>🍽️</div>
                    <p>{restaurant.name}'s menu will be available soon.</p>
                </div>
            )}

            {/* Toast */}
            <div className="cart-toast" id="toast" />
            <Footer/>
        </div>
    );
};

