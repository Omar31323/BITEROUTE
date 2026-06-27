
import { useState } from "react"
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';
const BASE_URL = import.meta.env.VITE_API_URL;
export const Item = ({ item, categories, setMenuItems }) => {
    const [preview, setPreview] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const { data, ok } = await apiFetch(`/admin/item/${item._id}/edit`, { method: 'PATCH', body: formData });
            if (ok) {
                setMenuItems(prev => prev.map(i => item._id === i._id ? { ...i, ...data.item } : i));
                toast.success('Item saved!');
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    const handleRemove = async () => {
        try {
            const { ok } = await apiFetch(`/admin/item/${item._id}/delete`, { method: 'DELETE' });
            if (ok) {
                setMenuItems(prev => prev.filter(i => item._id !== i._id));
            } else {
                toast.error('Something went wrong on the server.');
            }
        } catch (error) {
            toast.error('Could not reach the server. Check your connection.');
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="item-block">
                <div className="block-header">
                    <div className="block-title">
                        <div className="item-number">✦</div>
                        <span className="block-label">{item.name || 'Item'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className="save-btn">Save changes</button>
                        <button type="button" className="btn btn-danger" onClick={() => setShowRemoveModal(true)}>Remove</button>
                    </div>
                </div>

                <div className="grid">
                    <div className="field field-full">
                        <label>Item name *</label>
                        <input type="text" name="name" placeholder="e.g. Spaghetti Carbonara" defaultValue={item.name} maxLength={50} />
                    </div>
                    <div className="field">
                        <label>Price ($) *</label>
                        <input type="number" name="price" placeholder="0.00" min="0" step="0.01" defaultValue={item.price} />
                    </div>
                    <div className="field">
                        <label>Category *</label>
                        <select name="category" defaultValue={item.category || ''}>
                            <option value="">Select...</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field field-full">
                        <label>Description</label>
                        <textarea name="description" placeholder="Short description..." defaultValue={(item.description || '').trim()} />
                        <span className="field-hint">Optional</span>
                    </div>
                    <div className="field-full">
                        <div className="popular-row">
                            <input
                                type="checkbox"
                                name="popular"
                                id={`popular-${item._id}`}
                                defaultChecked={item.popular}
                            />
                            <label htmlFor={`popular-${item._id}`}>Mark as popular</label>
                        </div>
                    </div>
                    <div className="field field-full">
                        <label>Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} />
                        <span className="field-hint">Optional · JPG, PNG or WEBP</span>
                        <div className="img-preview">
                            {preview || item.image
                                ? <img src={preview || `${BASE_URL}${item.image}`} className="preview-img" alt={item.name} />
                                : <span className="preview-text">No image selected</span>}
                        </div>
                    </div>
                </div>
            </div>
        </form>

            {showRemoveModal && (
                <ConfirmModal
                    message={`Remove "${item.name}"?`}
                    subMessage="This will permanently delete this menu item."
                    confirmLabel="Remove item"
                    onConfirm={() => { setShowRemoveModal(false); handleRemove(); }}
                    onCancel={() => setShowRemoveModal(false)}
                />
            )}
        </>
    );
};
