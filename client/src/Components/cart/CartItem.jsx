
import { useState } from "react";
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';
const BASE_URL = import.meta.env.VITE_API_URL;
export const CartItem = ({ item, onUpdate, onDelete }) => {
  const toast = useToast();
  const handleItemUpdate
     = async (change) => {
    try {
      const { data, ok } = await apiFetch('/cart/item', {
        method: 'PATCH',
        body: { itemId: item.menuItemId, change },
      });
      if (ok) {
        onUpdate(item.menuItemId, data.quantity, data.extendedPrice, data.totalQuantity, data.totalPrice);
      } else {
        toast.error('Something went wrong on the server.');
      }
    } catch (error) {
      toast.error('Could not reach the server.');
    }
  };

  const handleItemDelete = async () => {
    try {
      const { data, ok } = await apiFetch('/cart/item', {
        method: 'DELETE',
        body: { itemId: item.menuItemId },
      });
      if (ok) {
        onDelete(item.menuItemId, data.totalPrice, data.totalQuantity);
      } else {
        toast.error('Something went wrong on the server.');
      }
    } catch (error) {
      toast.error('Could not reach the server.');
    }
  };

  return (
    <div className="item-row" data-itemid={item.menuItemId}>
      <div className="item-emoji">
        {item.image
          ? <img src={`${BASE_URL}${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          : '🍝'}
      </div>

      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-price">${Number(item.price).toFixed(2)} each</div>
      </div>

      <div className="qty-ctrl">
        <button
          className="qty-btn"
          disabled={item.quantity <= 1}
          onClick={() => handleItemUpdate('remove')}
        >−</button>
        <span className="qty-num">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => handleItemUpdate('add')}
        >+</button>
      </div>

      <div className="item-total">${Number(item.extendedPrice).toFixed(2)}</div>
      <button className="remove-btn" onClick={handleItemDelete}>✕</button>
    </div>
  );
};
