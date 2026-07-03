import { useEffect, useState } from "react"
import { Navbar } from "../shared/Navbar";
import { Restaurant } from "../restaurant/Restaurant";
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/apiFetch';
import { Footer } from "../shared/Footer";

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
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const toast = useToast();

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // reset page + hasMore when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [debouncedTerm, cuisine]);

    // fetch restaurants
    useEffect(() => {
        const searchForRestaurants = async () => {
            try {
                if (page === 1) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const params = new URLSearchParams();

                if (debouncedTerm.trim() !== '')
                    params.append('searchTerm', debouncedTerm);

                if (cuisine.trim() !== 'All')
                    params.append('cuisine', cuisine);

                params.append("page", page);

                const { data, ok } = await apiFetch(`/restaurants?${params.toString()}`);

                setIsLoading(false);
                setIsLoadingMore(false);

                if (ok) {
                    if (data.restaurants.length === 0) {
                        setHasMore(false);
                        return;
                    }

                    setRestaurantsList(prev =>
                        page === 1
                            ? data.restaurants
                            : [...prev, ...data.restaurants]
                    );
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            } catch (error) {
                setIsLoading(false);
                setIsLoadingMore(false);
                toast.error('Could not reach the server. Check your connection.');
            }
        };

        searchForRestaurants();
    }, [debouncedTerm, cuisine, page]);

    // infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isLoading || isLoadingMore || !hasMore) return;

            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 100
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, isLoadingMore, hasMore]);

    return (
        <div>
            <Navbar />

            <div className="hero-section">
                <h1>Hungry? We've got you <span>covered.</span></h1>
                <p>Order from the best restaurants near you, delivered fast.</p>

                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setDebouncedTerm(searchTerm)}
                        placeholder="Search restaurants or cuisines..."
                    />
                    <button onClick={() => setDebouncedTerm(searchTerm)}>
                        Search
                    </button>
                </div>
            </div>

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

            <div className="section-header">
                <h2>Popular Near You</h2>
                <span>
                    {restaurantsList.length} restaurants
                </span>
            </div>

            {isLoading && (
                <p style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
                    Loading...
                </p>
            )}

            {!isLoading && restaurantsList.length === 0 && (
                <div className="empty-state">
                    <div>🍽️</div>
                    <p>No restaurants found. Try a different search or cuisine.</p>
                </div>
            )}

            {!isLoading && restaurantsList.length > 0 && (
                <div className="restaurants-grid">
                    {restaurantsList.map(r => (
                        <Restaurant key={r._id} restaurant={r} />
                    ))}
                </div>
            )}

            {isLoadingMore && (
                <p style={{ textAlign: 'center', color: '#aaa' }}>
                    Loading more...
                </p>
            )}

            <Footer />
        </div>
    );
};