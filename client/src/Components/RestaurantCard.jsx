const BASE_URL = import.meta.env.VITE_API_URL;
export const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="card">
      <div className="card-heading">Order from</div>
      <div className="restaurant-row">
        <div className="rest-icon">
          {restaurant?.image
            ? <img src={`${BASE_URL}${restaurant.image}`} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
            : '🍕'}
        </div>
        <div>
          <div className="rest-name">{restaurant?.name || ''}</div>
          <div className="rest-sub">
            {restaurant?.prepTime || ''} ·{' '}
            {restaurant.deliveryFees === '0' || restaurant.deliveryFees === 0
              ? 'Free'
              : `$${Number(restaurant.deliveryFees).toFixed(2)}`} delivery
          </div>
        </div>
      </div>
    </div>
  );
};
