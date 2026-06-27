
import { useState } from "react"
import { ItemForm } from "./itemForm"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';

export const AddItems = () => {
    const { id } = useParams();
    const [itemFormsList, setItemFormsList] = useState([Date.now()]);
    const navigate = useNavigate();
    const toast = useToast();

    const removeItem = (formId) => {
        setItemFormsList(prev => prev.filter(item => formId !== item));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            itemFormsList.forEach(formId => formData.append('itemIds', formId));
            const { ok } = await apiFetch(`/admin/restaurant/${id}/menu`, { method: 'POST', body: formData });
            if (ok) {
                toast.success('Items added to menu!');
                navigate(`/restaurant/${id}/menu`);
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    const itemCount = itemFormsList.length;

    return (
        <div>
            <header>
                <Link to='/' className="brand">
                    BITE<span>ROUTE</span>
                    <span className="admin-tag">Admin</span>
                </Link>
                <div className="header-right">
                    <span className="back-btn" onClick={() => navigate(-1)}>← Dashboard</span>
                </div>
            </header>

            <div className="page">
                <div className="page-title">Add Menu Items</div>
                <div className="page-sub">Fill in each block and submit when done.</div>

                <form onSubmit={handleSubmit}>
                    <div className="items-list">
                        {itemFormsList.map((formId, index) => (
                            <ItemForm
                                key={formId}
                                id={formId}
                                index={index + 1}
                                restaurantId={id}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="add-block-btn"
                        onClick={() => setItemFormsList(prev => [...prev, Date.now()])}
                    >
                        + Add another item
                    </button>

                    <div className="submit-bar">
                        <span className="items-count">
                            {itemCount !== 1 ? `${itemCount} items` : `${itemCount} item`}
                        </span>
                        <button type="submit" className="btn btn-primary">Submit all items</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

