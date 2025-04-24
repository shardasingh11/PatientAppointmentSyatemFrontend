import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


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
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      fetchData(storedToken)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [token])

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
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};