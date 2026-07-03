
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Order } from "./Order";
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';

export const RestaurantOrders = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [ordersList, setOrdersList] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const { data, ok } = await apiFetch(`/admin/restaurants/${id}/orders`);
                if (ok) {
                    setOrdersList(data.orders);
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
        loadOrders();
    }, []);

    return (
        <div>
            <header>
                <Link to='/' className="brand">
                    BITE<span>ROUTE</span>
                    <span className="admin-tag">Admin</span>
                </Link>
                <div className="header-right">
                    <span className="back-btn" onClick={() => navigate(-1)}>← Restaurants</span>
                </div>
            </header>

            <div className="page" style={{ maxWidth: '900px' }}>
                <div className="page-title">Manage Orders</div>
                <div className="page-sub">View and update the status of all incoming orders.</div>

                {isLoading && <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>}

                {!isLoading && ordersList.length === 0 && (
                    <div className="empty-state">
                        <div>📋</div>
                        <p>No orders have been recorded for this restaurant yet.</p>
                    </div>
                )}

                {!isLoading && ordersList.length > 0 && (
                    <div className="admin-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList.map(order => (
                                    <Order key={order._id} order={order} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
