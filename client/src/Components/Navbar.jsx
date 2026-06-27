
import { useAuth } from "../Context/AuthContext"
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header>
            {/* Brand */}
            <Link to='/' className="brand">
                BITE<span>ROUTE</span>
                {user?.isAdmin && <span className="admin-tag">Admin</span>}
            </Link>

            {/* Nav links */}
            <nav>
                {user ? (
                    <>
                        {user.isAdmin ? (
                            <Link to='/addRestaurant'>Add Restaurant</Link>
                        ) : (
                            <>
                                <Link to='/Orders'>My Orders</Link>
                                <Link to='/Cart' className="cart-btn">
                                    🛒 Cart
                                    {cartCount > 0 && (
                                        <span className="cart-count">{cartCount}</span>
                                    )}
                                </Link>
                            </>
                        )}
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/signup'>Create account</Link>
                        <Link to='/login'>Login</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
