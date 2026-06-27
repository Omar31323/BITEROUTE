
import { useState } from "react";
import { z } from "zod";
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';

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

export const AddRestaurant = () => {
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

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
            const { ok } = await apiFetch('/restaurants', { method: 'POST', body: formData });
            if (ok) {
                toast.success('Restaurant added successfully!');
                navigate('/');
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
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

            <div className="page">
                <div className="page-title">Add New Restaurant</div>
                <div className="page-sub">Fill in the details below to list a new restaurant on BiteRoute.</div>

                <form onSubmit={handleSubmit}>

                    {/* Basic Info */}
                    <div className="card">
                        <div className="card-heading">Basic Info</div>
                        <div className="grid">
                            <div className="field field-full">
                                <label>Restaurant name *</label>
                                <input type="text" name="name" placeholder="e.g. Luigi's Trattoria" />
                                {errors.name && <span className="error-msg">{errors.name}</span>}
                            </div>
                            <div className="field">
                                <label>Cuisine *</label>
                                <select name="cuisine">
                                    <option value="">Select cuisine...</option>
                                    <option value="Burgers">Burgers</option>
                                    <option value="Sushi">Sushi</option>
                                    <option value="Italian">Italian</option>
                                    <option value="Mexican">Mexican</option>
                                    <option value="Chicken">Chicken</option>
                                    <option value="Healthy">Healthy</option>
                                    <option value="Asian">Asian</option>
                                    <option value="Pizza">Pizza</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Lebanese">Lebanese</option>
                                </select>
                                {errors.cuisine && <span className="error-msg">{errors.cuisine}</span>}
                            </div>
                            <div className="field">
                                <label>Rating</label>
                                <input type="number" name="rating" placeholder="e.g. 4.5" min="0" max="5" step="0.1" />
                                <span className="field-hint">Optional · 0 to 5</span>
                            </div>
                            <div className="field field-full">
                                <label>Description</label>
                                <textarea name="description" placeholder="A short description of the restaurant..." />
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="card">
                        <div className="card-heading">Delivery Details</div>
                        <div className="grid">
                            <div className="field">
                                <label>Prep time *</label>
                                <input type="text" name="prepTime" placeholder="e.g. 20–30 min" />
                                {errors.prepTime && <span className="error-msg">{errors.prepTime}</span>}
                            </div>
                            <div className="field">
                                <label>Delivery fees *</label>
                                <input type="text" name="deliveryFees" placeholder="e.g. 0 or 1.99" />
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
                                <input type="text" name="street" placeholder="e.g. 14 Via Roma" />
                                {errors.street && <span className="error-msg">{errors.street}</span>}
                            </div>
                            <div className="field">
                                <label>City *</label>
                                <input type="text" name="city" placeholder="e.g. Beirut" />
                                {errors.city && <span className="error-msg">{errors.city}</span>}
                            </div>
                            <div className="field">
                                <label>Phone number</label>
                                <input type="text" name="phone" placeholder="e.g. +961 123 456 789" />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="card">
                        <div className="card-heading">Restaurant Image</div>
                        <div className="grid">
                            <div className="field field-full">
                                <label>Upload image</label>
                                <input type="file" accept="image/*" onChange={handleChange} />
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
                        <button type="reset" className="btn">Reset</button>
                        <button type="submit" className="btn btn-primary">Add Restaurant</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

