import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('/');

  // Simulate checking if user is logged in
  useEffect(() => {
    // This would normally come from your auth system
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(loggedInUser).username);
    }
    
    // Set active page based on current path
    setActivePage(window.location.pathname);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    setDropdownOpen(false);
    // Redirect to home page
    window.location.href = '/';
  };


  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          {/* Logo */}
          <div className="flex space-x-4">
            <div className="flex items-center py-4">
              <span className="font-bold text-xl">Patient Appointment System</span>
            </div>
          </div>

          {/* Primary nav - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="/" 
              className={`py-4 px-3 transition duration-300 rounded ${
                activePage === '/' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
              }`}
            >
              Home
            </a>
            
            {!isLoggedIn ? (
              <a 
                href="/register" 
                className={`py-4 px-3 transition duration-300 rounded ${
                  activePage === '/register' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                SignUp/SignIn
              </a>
            ) : (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center py-4 px-3 hover:bg-gray-700 transition duration-300 rounded"
                >
                  <span className="mr-1">{username}</span>
                  <ChevronDown size={16} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a 
                      href="/profile" 
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        activePage === '/profile' ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </div>
                    </a>
                    <a 
                      href="/appointments" 
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        activePage === '/appointments' ? 'bg-gray-100' : ''
                      }`}
                    >
                      My Appointments
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button p-2" onClick={toggleNavbar}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <a 
          href="/" 
          className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${
            activePage === '/' ? 'bg-gray-700' : ''
          }`}
        >
          Home
        </a>
        
        {!isLoggedIn ? (
          <a 
            href="/register" 
            className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${
              activePage === '/register' ? 'bg-gray-700' : ''
            }`}
          >
            SignUp/SignIn
          </a>
        ) : (
          <>
            <a 
              href="/profile" 
              className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${
                activePage === '/profile' ? 'bg-gray-700' : ''
              }`}
            >
              Profile
            </a>
            <a 
              href="/appointments" 
              className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${
                activePage === '/appointments' ? 'bg-gray-700' : ''
              }`}
            >
              My Appointments
            </a>
            <button 
              onClick={handleLogout}
              className="block w-full text-left py-2 px-4 text-sm text-white hover:bg-gray-700 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      
      </div>
    </nav>
  );
};

export default Navbar;