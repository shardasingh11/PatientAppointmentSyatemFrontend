import { createContext, useState, useEffect, useContext } from 'react';
import { useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [expiryTime, setExpiryTime] = useState(localStorage.getItem('expiryTime') || null);
  const [refreshUserTrigger, setRefreshUserTrigger] = useState(0);

  const checkTokenExpiration = useCallback(() => {
    if (expiryTime) {

      const now = new Date();
      const expiry = new Date(expiryTime);
      
      if (now >= expiry) {
        // Token expired, logout the user
        logout();
      }
    }
  }, [expiryTime]);

  useEffect(() => {
    if (token && expiryTime) {
      // Check immediately on mount
      checkTokenExpiration();
      
      // Then check every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [token, expiryTime, checkTokenExpiration]);


  const fetchData = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/users/user", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error while calling this http://localhost:8000/users/user api');
      }

      const userData = await response.json();
      return userData;

    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {

    // const storedToken = localStorage.getItem('access_token');
    console.log("logging from the useEffect of AuthContext"); 
    if (token) {
      console.log("inside if");
      fetchData(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [refreshUserTrigger, token])

  useEffect(() => {
    // Check if user is logged in when the app loads
    console.log("logging useEffect below user api");
    if (!token) {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Function to refresh user data
  const refreshUserData = () => {
    setRefreshUserTrigger(prev => prev + 1);
  }

  // Login function
  const login = (newToken, newExpiryTime) => {
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('expiryTime', newExpiryTime.toISOString());
    setToken(newToken);
    setIsLoggedIn(true);
    setExpiryTime(newExpiryTime.toISOString());
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiryTime');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    setExpiryTime(null);
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, user, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};