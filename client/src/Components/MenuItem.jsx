
import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from '../Context/AuthContext';
import { apiFetch } from '../apiFetch';
const BASE_URL = import.meta.env.VITE_API_URL;

export const MenuItem = ({ menuItem }) => {
    const [menuItemQuantity, setMenuItemQuantity] = useState(0);
    const { incrementCount, decrementCount } = useCart();
    const { user } = useAuth();

    const handleClick = async (change) => {
        const { data, ok } = await apiFetch('/restaurant/cart/item', {
            method: 'PATCH',
            body: { menuItemId: menuItem._id, name: menuItem.name, price: menuItem.price,image:menuItem.image, restaurantId: menuItem.restaurant, change },
        });

        if (ok) {
            setMenuItemQuantity(data.menuItemQuantity);
            change === 'add' ? incrementCount() : decrementCount();
        }
    };

    return (
        <div className="menu-item">
            <div className="item-img">
                {menuItem.image
                    ? <img src={`${BASE_URL}${menuItem.image}`} alt={menuItem.name} />
                    : '🍽️'}
            </div>

            <div className="item-info">
                <div className="item-name">
                    {menuItem.name}
                    {menuItem.popular && <span className="popular-badge">Popular</span>}
                </div>
                <div className="item-desc">{menuItem.description}</div>
                <div className="item-price">${Number(menuItem.price).toFixed(2)}</div>
            </div>

            {!user?.isAdmin && <div className="item-action">
                {menuItemQuantity === 0 ? (
                    <button className="add-btn" onClick={() => handleClick('add')}>+</button>
                ) : (
                    <div className="qty-ctrl">
                        <button
                            className="qty-btn"
                            onClick={() => handleClick('remove')}
                            disabled={menuItemQuantity === 0}
                        >−</button>
                        <span className="qty-num">{menuItemQuantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => handleClick('add')}
                        >+</button>
                    </div>
                )}
            </div>}
        </div>
    );
};
