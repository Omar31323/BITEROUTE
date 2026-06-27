
import { useEffect, useState } from "react"
import { Navbar } from "./Navbar";
import { Restaurant } from "./Restaurant";
import { useToast } from '../Context/ToastContext';
import { apiFetch } from '../apiFetch';
import { Footer } from "./Footer";

const CUISINES = [
    { label: 'All', emoji: '' },
    { label: 'Italian', emoji: '🍕' },
    { label: 'Burgers', emoji: '🍔' },
    { label: 'Sushi', emoji: '🍣' },
    { label: 'Mexican', emoji: '🌮' },
    { label: 'Chicken', emoji: '🍗' },
    { label: 'Healthy', emoji: '🥗' },
    { label: 'Asian', emoji: '🍜' },
    { label: 'Pizza', emoji: '🍕' },
    { label: 'Lebanese', emoji: '🥗' },
];

export const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [cuisine, setCuisine] = useState('All');
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => { clearTimeout(timer) }
    }, [searchTerm]);

    useEffect(() => {
        const searchForRestaurants = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();
                if (debouncedTerm.trim() !== '')
                    params.append('searchTerm', debouncedTerm);
                if (cuisine.trim() !== 'All')
                    params.append('cuisine', cuisine);

                const { data, ok } = await apiFetch(`/restaurants?${params.toString()}`);
                setIsLoading(false);
                if (ok) {
                    setRestaurantsList(data.restaurants);
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            } catch (error) {
                setIsLoading(false);
                toast.error('Could not reach the server. Check your connection.');
            }
        }
        searchForRestaurants();
    }, [debouncedTerm, cuisine]);

    return (
        <div>
            <Navbar />

            {/* Hero */}
            <div className="hero-section">
                <h1>Hungry? We've got you <span>covered.</span></h1>
                <p>Order from the best restaurants near you, delivered fast.</p>
                <div className="search-bar">
                    <input
                        id="search"
                        type="text"
                        name="searchkey"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setDebouncedTerm(searchTerm)}
                        value={searchTerm}
                        placeholder="Search restaurants or cuisines..."
                    />
                    <button type="button" onClick={() => setDebouncedTerm(searchTerm)}>Search</button>
                </div>
            </div>

            {/* Cuisine filters */}
            <div className="filters">
                {CUISINES.map(({ label, emoji }) => (
                    <button
                        key={label}
                        className={`filter-btn${cuisine === label ? ' active' : ''}`}
                        onClick={() => setCuisine(label)}
                    >
                        {emoji ? `${emoji} ${label}` : label}
                    </button>
                ))}
            </div>

            {/* Section header */}
            <div className="section-header">
                <h2>Popular Near You</h2>
                <span id="restaurants-count">
                    {restaurantsList.length !== 1
                        ? `${restaurantsList.length} restaurants`
                        : `${restaurantsList.length} restaurant`}
                </span>
            </div>

            {/* Restaurant grid */}
            {isLoading && (
                <p style={{ color: '#aaa', fontSize: '0.875rem', textAlign: 'center', padding: '3rem' }}>Loading...</p>
            )}
            {!isLoading && restaurantsList.length === 0 && (
                <div className="empty-state">
                    <div>🍽️</div>
                    <p>No restaurants found. Try a different search or cuisine.</p>
                </div>
            )}
            {!isLoading && restaurantsList.length > 0 && (
                <div className="restaurants-grid">
                    {restaurantsList.map(restaurant => (
                        <Restaurant key={restaurant._id} restaurant={restaurant} />
                    ))}
                </div>
            )}
            <Footer/>
        </div>
    );
}
