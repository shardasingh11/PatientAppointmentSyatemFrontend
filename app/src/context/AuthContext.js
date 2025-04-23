import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check if user is logged in when the app loads
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
          setIsLoggedIn(true);
        }
      }, []);
      
      // Login function
      const login = (token) => {
        localStorage.setItem('access_token', token);
        setToken(token);
        setIsLoggedIn(true);
      };
      
      // Logout function
      const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setIsLoggedIn(false);
    };
    
    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};