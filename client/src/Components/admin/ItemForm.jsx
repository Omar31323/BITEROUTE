
import { useEffect, useState } from "react";
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';

export const ItemForm = ({ restaurantId, id, index, onRemove }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [preview, setPreview] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data, ok } = await apiFetch(`/admin/item/${restaurantId}/categories`);
                if (ok) {
                    setCategories(data.categories);
                    setIsLoading(false);
                } else {
                    toast.error('Something went wrong on the server.');
                }
            } catch (error) {
                toast.error('Could not reach the server. Check your connection.');
                setIsLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        setCategories(prev => [...prev, newCategory.trim()]);
        setNewCategory('');
    };

    return (
        <div className="item-block">
            <div className="block-header">
                <div className="block-title">
                    <div className="item-number">{index}</div>
                    <span className="block-label">Item {index}</span>
                </div>
                <button type="button" className="btn btn-danger" onClick={() => onRemove(id)}>
                    Remove
                </button>
            </div>

            <div className="grid">
                <div className="field field-full">
                    <label>Item name *</label>
                    <input type="text" name={`name-${id}`} placeholder="e.g. Spaghetti Carbonara" maxLength={50} />
                </div>
                <div className="field">
                    <label>Price ($) *</label>
                    <input type="number" name={`price-${id}`} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="field">
                    <label>Category *</label>
                    <select name={`category-${id}`}>
                        <option value="">Select...</option>
                        {!isLoading && categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="New category..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                        />
                        <button type="button" className="btn" onClick={handleAddCategory}>
                            Add
                        </button>
                    </div>
                    <span className="field-hint">Type a new category and click Add</span>
                </div>
                <div className="field field-full">
                    <label>Description</label>
                    <textarea name={`description-${id}`} placeholder="Short description..." />
                    <span className="field-hint">Optional</span>
                </div>
                <div className="field-full">
                    <div className="popular-row">
                        <input
                            type="checkbox"
                            name={`popular-${id}`}
                            id={`popular-${id}`}
                        />
                        <label htmlFor={`popular-${id}`}>Mark as popular</label>
                    </div>
                </div>
                <div className="field field-full">
                    <label>Image</label>
                    <input type="file" name={`image-${id}`} accept="image/*" onChange={handleChange} />
                    <span className="field-hint">Optional · JPG, PNG or WEBP</span>
                    <div className="img-preview">
                        {preview
                            ? <img className="preview-img" src={preview} alt="Preview" />
                            : <span className="preview-text">No image selected</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
