
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Item } from './Item';
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';

export const EditMenu = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const { data, ok } = await apiFetch(`/admin/restaurant/${id}/editItems`);
                if (ok) {
                    setMenuItems(data.menuItems);
                    setCategories(data.categories);
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
        loadMenu();
    }, []);

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
                {isLoading && <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>}

                {!isLoading && menuItems.length === 0 && (
                    <div className="empty-state">
                        <div>🍽️</div>
                        <p>No items were found for this restaurant.</p>
                        <Link to={`/restaurant/${id}/addItems`} className="browse-btn">Add items</Link>
                    </div>
                )}

                {!isLoading && menuItems.length > 0 && (
                    <>
                        <div className="page-title">Edit Menu Items</div>
                        <div className="page-sub">Update each item and save when done.</div>

                        <div className="items-list">
                            {menuItems.map(item => (
                                <Item
                                    key={item._id}
                                    item={item}
                                    categories={categories}
                                    setMenuItems={setMenuItems}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

