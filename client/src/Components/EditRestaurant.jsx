
import { useState, useEffect } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';
const BASE_URL = import.meta.env.VITE_API_URL;
const restaurantSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    cuisine: z.string().min(1, 'Please select a cuisine'),
    rating: z.coerce.number().min(0).max(5).optional(),
    description: z.string().optional(),
    prepTime: z.string().min(1, 'Please enter a prep time'),
    deliveryFees: z.string().min(1, 'Please enter delivery fees'),
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    phone: z.string().optional(),
});

export const EditRestaurant = () => {
    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [cuisineList, setCuisineList] = useState([]);
    const [preview, setPreview] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data, ok } = await apiFetch(`/admin/restaurant/${id}/manage`);
                if (ok) {
                    setRestaurant(data.restaurant);
                    setPreview(`${BASE_URL}${data.restaurant.image}`);
                    setCuisineList(data.cuisines);
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
        loadData();
    }, []);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = restaurantSchema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            setErrors(result.error.flatten().fieldErrors);
            return;
        }
        setErrors({});
        try {
            const { ok } = await apiFetch(`/admin/restaurant/${restaurant._id}/edit`, { method: 'PATCH', body: formData });
            if (ok) {
                toast.success('Changes saved!');
                navigate('/');
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            const { ok } = await apiFetch(`/admin/restaurant/${restaurant._id}/delete`, { method: 'DELETE' });
            if (ok) {
                navigate('/');
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

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

            {isLoading && (
                <div className="page">
                    <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>
                </div>
            )}

            {!isLoading && !restaurant && (
                <div className="empty-state" style={{ marginTop: '5rem' }}>
                    <div>🍽️</div>
                    <p>Restaurant not found. It may have been moved or deleted.</p>
                    <Link to='/' className="browse-btn">Back to restaurants</Link>
                </div>
            )}

            {!isLoading && restaurant && (
                <div className="page">
                    <div className="page-title">Manage Restaurant</div>
                    <div className="page-sub">Update details for {restaurant.name} or remove it from the platform.</div>

                    <form onSubmit={handleSubmit}>

                        {/* Basic Info */}
                        <div className="card">
                            <div className="card-heading">Basic Info</div>
                            <div className="grid">
                                <div className="field field-full">
                                    <label>Restaurant name *</label>
                                    <input type="text" name="name" placeholder="e.g. Luigi's Trattoria" minLength={2} maxLength={50} defaultValue={restaurant.name || ''} />
                                    {errors.name && <span className="error-msg">{errors.name}</span>}
                                </div>
                                <div className="field">
                                    <label>Cuisine *</label>
                                    <select name="cuisine" defaultValue={restaurant.cuisine || ''}>
                                        <option value="">Select cuisine...</option>
                                        {cuisineList.map(cuisine => (
                                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                                        ))}
                                    </select>
                                    {errors.cuisine && <span className="error-msg">{errors.cuisine}</span>}
                                </div>
                                <div className="field">
                                    <label>Rating</label>
                                    <input type="number" name="rating" placeholder="e.g. 4.5" min="0" max="5" step="0.1" defaultValue={restaurant.rating || ''} />
                                    <span className="field-hint">Optional · 0 to 5</span>
                                </div>
                                <div className="field field-full">
                                    <label>Description</label>
                                    <textarea name="description" placeholder="A short description..." defaultValue={restaurant.description || ''} />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="card">
                            <div className="card-heading">Delivery Details</div>
                            <div className="grid">
                                <div className="field">
                                    <label>Prep time *</label>
                                    <input type="text" name="prepTime" placeholder="e.g. 20–30 min" defaultValue={restaurant.prepTime || ''} />
                                    {errors.prepTime && <span className="error-msg">{errors.prepTime}</span>}
                                </div>
                                <div className="field">
                                    <label>Delivery fees *</label>
                                    <input type="text" name="deliveryFees" placeholder="e.g. 1.99" defaultValue={restaurant.deliveryFees ?? ''} />
                                    {errors.deliveryFees && <span className="error-msg">{errors.deliveryFees}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="card">
                            <div className="card-heading">Address</div>
                            <div className="grid">
                                <div className="field field-full">
                                    <label>Street *</label>
                                    <input type="text" name="street" placeholder="e.g. 14 Via Roma" defaultValue={restaurant.addresses?.[0]?.street || ''} />
                                    {errors.street && <span className="error-msg">{errors.street}</span>}
                                </div>
                                <div className="field">
                                    <label>City *</label>
                                    <input type="text" name="city" placeholder="e.g. Beirut" defaultValue={restaurant.addresses?.[0]?.city || ''} />
                                    {errors.city && <span className="error-msg">{errors.city}</span>}
                                </div>
                                <div className="field">
                                    <label>Phone number</label>
                                    <input type="text" name="phone" placeholder="e.g. +961 70 123 456" defaultValue={restaurant.addresses?.[0]?.phone || ''} />
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="card">
                            <div className="card-heading">Restaurant Image</div>
                            <div className="grid">
                                <div className="field field-full">
                                    <label>Upload image</label>
                                    <input type="file" name="image" accept="image/*" onChange={handleChange} />
                                    <span className="field-hint">Optional · JPG, PNG or WEBP recommended</span>
                                </div>
                                <div className="field-full">
                                    <div className="img-preview">
                                        {preview
                                            ? <img className="preview-img" src={preview} alt="Preview" />
                                            : <span className="preview-text">No image selected</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="submit-bar">
                            <button type="button" className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                                Delete Restaurant
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {showDeleteModal && (
                <ConfirmModal
                    message={`Delete ${restaurant.name}?`}
                    subMessage="This will permanently remove the restaurant and all its data. This cannot be undone."
                    confirmLabel="Delete Restaurant"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};
