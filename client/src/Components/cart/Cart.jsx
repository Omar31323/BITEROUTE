import { useEffect, useState, useRef } from "react"
import { RestaurantCard } from "../restaurant/RestaurantCard"
import { useCart } from "../../context/CartContext";
import { CartItem } from "./CartItem";
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';
import { Footer } from "../shared/Footer";

export const Cart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { cartCount, setCartCount } = useCart();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [restaurant, setRestaurant] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCart = async () => {
    try {
      const { data, ok } = await apiFetch('/cart');
      if (ok) {
        setCart(data.cart);
        setTotalPrice(data.totalPrice);
        setRestaurant(data.restaurant);
        setIsLoading(false);
      } else {
        toast.error('Something went wrong on the server.');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Could not reach the server. Check your connection.');
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleItemUpdate = (itemId, quantity, extendedPrice, totalQuantity, totalPrice) => {
    setCart(prev =>
      prev.map(item =>
        item.menuItemId === itemId ? { ...item, quantity, extendedPrice } : item)
    );
    setTotalPrice(totalPrice);
    setTotalQuantity(totalQuantity);
    setCartCount(totalQuantity);
  };

  const handleItemDelete = (itemId, totalPrice, totalQuantity) => {
    setCart(prev => prev.filter(item => item.menuItemId !== itemId));
    setTotalPrice(totalPrice);
    setTotalQuantity(totalQuantity);
    setCartCount(totalQuantity);
  };

  const placeOrder = async () => {
    try {
      const orderNotes = textareaRef.current?.value;
      const { ok } = await apiFetch('/restaurant/order', {
        method: 'POST',
        body: { orderNotes },
      });
      if (ok) {
        setOrderPlaced(true);
        setCartCount(0);
        toast.success("Order placed! We'll have it ready soon.");
      } else {
        toast.error('Something went wrong on the server.');
      }
    } catch (error) {
      toast.error('Could not reach the server. Check your connection.');
    }
  };

  const deliveryFee = restaurant?.deliveryFees === '0' || !restaurant?.deliveryFees
    ? 0
    : Number(restaurant.deliveryFees);

  return (
    <div>
      {/* Header */}
      <header>
        <Link to='/' className="brand">BITE<span>ROUTE</span></Link>
        <div className="header-right">
          <span className="back-btn" onClick={() => navigate(-1)}>← Back to menu</span>
        </div>
      </header>

      <div className="page">
        <div className="page-title">Your Cart</div>
        <div className="page-sub">
          {cartCount !== 1 ? `${cartCount} items` : `${cartCount} item`}
        </div>

        {orderPlaced ? (
          <div className="empty-state">
            <div>🎉</div>
            <p>Your order has been placed! We'll have it ready soon.</p>
            <Link to='/' className="browse-btn">Back to restaurants</Link>
          </div>
        ) : !isLoading && cart.length > 0 ? (
          <>
            {/* Restaurant info */}
            {restaurant && <RestaurantCard restaurant={restaurant} />}

            {/* Cart items */}
            <div className="card">
              {cart.map(item => (
                <CartItem
                  key={item.menuItemId}
                  item={item}
                  onUpdate={handleItemUpdate}
                  onDelete={handleItemDelete}
                />
              ))}
            </div>

            {/* Order notes */}
            <div className="card">
              <div className="card-heading">Order notes</div>
              <div className="field">
                <textarea
                  ref={textareaRef}
                  name="orderNotes"
                  placeholder="Any special requests? e.g. no onions, extra sauce, ring the bell..."
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="card">
              <div className="card-heading">Order summary</div>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${Number(totalPrice).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(Number(totalPrice || 0) + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <button className="checkout-btn" onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="empty-state">
              <div>🛒</div>
              <p>Your cart is empty. Add some food to get started.</p>
              <Link to='/' className="browse-btn">Browse restaurants</Link>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};