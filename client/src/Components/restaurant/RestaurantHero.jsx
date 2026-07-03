const BASE_URL = import.meta.env.VITE_API_URL;
export const RestaurantHero = ({ restaurant }) => {
    return (
        <div className="restaurant-hero" data-restaurantid={restaurant._id}>
            <div className="hero-inner">
                <div className="hero-img"><img src={`${BASE_URL}${restaurant.image}`} alt="" /></div>
                <div className="hero-info">
                    <h1>{restaurant.name}</h1>
                    <p>{restaurant.description}</p>
                    <div style={{ fontSize: "0.82rem", color: "#888", marginBottom: "0.6rem" }}>
                        📍 {restaurant.addresses[0]?.street}, {restaurant.addresses[0]?.city}
                    </div>
                    <div className="hero-tags">
                        <span className="tag tag-rating">⭐ {restaurant.rating}</span>
                        <span className="tag tag-time">🕐 {restaurant.prepTime}</span>
                        <span className="tag tag-delivery">
                            🚚{" "}
                            {restaurant.deliveryFees === "0"
                                ? "Free"
                                : `$${Number(restaurant.deliveryFees).toFixed(2)}`}{" "}
                            delivery
                        </span>
                        <span className="tag tag-cuisine">{restaurant.cuisine}</span>
                    </div>
                </div>
            </div>
        </div>
    )


}