import { createContext, useContext, useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/logout`,{credentials:'include'});
            if(response.ok){
                const data = await response.json();
            }
        } catch (error) {
            alert('could not send request: '+ error.message);
        }
        setUser(null);
    }
    useEffect(() => {
        fetch(`${BASE_URL}/persistUser`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .finally(() => setLoading(false))
    },
        []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);