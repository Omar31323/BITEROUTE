
import { createContext, useEffect, useState, useContext } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await fetch(`${BASE_URL}/cart/count', { credentials: 'include' }`);
                if (response.ok) {
                    const data = await response.json();
                    setCartCount(data);
                }
               
            } catch (error) {
               
            }
        };
        fetchCartCount();
    }, []);

    const incrementCount = () => setCartCount(prev => prev + 1);
    const decrementCount = () => setCartCount(prev => prev - 1);

    return (
        <CartContext.Provider value={{ cartCount, incrementCount, decrementCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
