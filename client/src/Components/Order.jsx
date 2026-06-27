
import { useState } from "react";
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';

export const Order = ({ order }) => {
    const [status, setStatus] = useState(order.status);
    const toast = useToast();

    const handleChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const { ok } = await apiFetch(`/admin/orders/${order._id}/status`, {
                method: 'PATCH',
                body: { status: newStatus },
            });
            if (ok) {
                setStatus(newStatus);
                toast.success('Order status updated.');
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    return (
        <tr>
            <td>
                <strong>#{order._id.slice(-6)}</strong>
                <div className="meta">
                    {new Date(order.createdAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </td>
            <td>
                <div>{order.user.firstname} {order.user.lastname}</div>
                <div className="meta">{order.user.email}</div>
            </td>
            <td className="summary">
                {order.items.map(item => `${item.quantity}× ${item.name}`).join(', ')}
            </td>
            <td><strong>${Number(order.totalPrice).toFixed(2)}</strong></td>
            <td>
                <select
                    name="status"
                    className="status-select"
                    value={status}
                    onChange={handleChange}
                >
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </td>
        </tr>
    );
};
