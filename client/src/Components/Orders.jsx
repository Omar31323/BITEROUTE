
import { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';
import { Footer } from "./Footer";

export const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchOrders = async () => {
        try {
            const { data, ok } = await apiFetch('/orders');
            if (ok) {
                setOrdersList(data.orders);
                setIsLoading(false);
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const statusClass = (status) => {
        const map = {
            preparing: 'badge-preparing',
            out_for_delivery: 'badge-out_for_delivery',
            delivered: 'badge-delivered',
            cancelled: 'badge-cancelled',
        };
        return `badge ${map[status] || ''}`;
    };

    return (
        <div>
            {/* Header */}
            <header>
                <Link to='/' className="brand">BITE<span>ROUTE</span></Link>
                <div className="header-right">
                    <span className="back-btn" onClick={() => navigate(-1)}>← Restaurants</span>
                </div>
            </header>

            <div className="page">
                <div className="page-title">My Orders</div>
                <div className="page-sub">Track your current and past orders.</div>

                {isLoading && <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>}

                {!isLoading && ordersList.length === 0 && (
                    <div className="empty-state">
                        <div>🛒</div>
                        <p>You haven't placed any orders yet.</p>
                        <Link to='/' className="browse-btn">Browse restaurants</Link>
                    </div>
                )}

                {!isLoading && ordersList.length > 0 && ordersList.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-top">
                            <div>
                                <div className="order-rest">{order.restaurant?.name || 'Restaurant'}</div>
                                <div className="order-meta">
                                    Order #{order._id} ·{' '}
                                    {new Date(order.createdAt).toLocaleString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <span className={statusClass(order.status)}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="order-items-list">
                            {order.items.map(item => (
                                <div key={item._id} className="order-item-row">
                                    <span>{item.quantity}× {item.name}</span>
                                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-bottom">
                            {order.notes && (
                                <div className="order-notes">📝 {order.notes}</div>
                            )}
                            <div className="order-total">
                                Total: <span>${Number(order.totalPrice).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};
