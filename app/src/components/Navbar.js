import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const location = useLocation();





  useEffect(() => {
    if (user) {
      setIsUserLoading(false);
    }
  }, [user]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
            <Link
              to="/"
              className={`py-4 px-3 transition duration-300 rounded ${location.pathname === '/' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
            >
              Home
            </Link>

            {!isLoggedIn ? (
              <Link
                to="/login-page"
                className={`py-4 px-3 transition duration-300 rounded ${location.pathname === '/login-page' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                  }`}
              >
                SignIn
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center py-4 px-3 hover:bg-gray-700 transition duration-300 rounded"
                >
                  {isUserLoading ? (
                    <div className="h-4 w-16 bg-gray-600 animate-pulse rounded"></div>
                  ) : (
                    <span className="mr-1">{user?.username}</span>
                  )}
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user?.user_role === "patient" && (
                      user?.is_profile_created ? (
                        <Link
                          to="/patient-profile"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/patient-profile' ? 'bg-gray-100' : ''
                            }`}
                        >
                          <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            Profile
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to="/create-profile"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === "/create-profile" ? "bg-gray-100" : ""
                            }`}
                        >
                          <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            Profile
                          </div>
                        </Link>
                      )

                    )
                    }

                    {user?.user_role === "doctor" && (
                      user?.is_profile_created ? (
                        <Link
                          to="/doctor-profile"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/doctor-profile' ? 'bg-gray-100' : ''
                            }`}
                        >
                          <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            Profile
                          </div>
                        </Link>

                      ) : (
                        <Link
                          to="/create-doctor-profile"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/create-doctor-profile' ? 'bg-gray-100' : ''
                            }`}
                        >
                          <div className="flex items-center">
                            <User size={16} className="mr-2" />
                            Profile
                          </div>
                        </Link>
                      )
                    )
                    }

                    {user?.user_role === "admin" ? (
                      <Link
                        to="/admin-dashboard"
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/admin-dashboard' ? 'bg-gray-100' : ''
                          }`}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      user?.user_role == "patient" ? (
                        <Link
                          to="/patient-appointment"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/appointments' ? 'bg-gray-100' : ''
                            }`}
                        >
                          My Appointments
                        </Link>
                      ) : (
                        <Link
                          to="/doctor-appointment"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${location.pathname === '/appointments' ? 'bg-gray-100' : ''
                            }`}
                        >
                          My Appointments
                        </Link>
                      )

                    )
                    }


                    <button
                      onClick={logout}
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
            {isLoggedIn && (
              user?.user_role == "patient" && (
                <Link
                  to="/doctors-list-in-patient"
                  className={`py-4 px-3 transition duration-300 rounded ${location.pathname === '/doctors-list-in-patient' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                    }`}
                >
                  Doctors
                </Link>
              )
            )

            }

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
        <Link
          to="/"
          className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${location.pathname === '/' ? 'bg-gray-700' : ''
            }`}
        >
          Home
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login-page"
            className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${location.pathname === '/login-page' ? 'bg-gray-700' : ''
              }`}
          >
            SignIn
          </Link>
        ) : (
          <>
            <Link
              to="/profile"
              className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${location.pathname === '/profile' ? 'bg-gray-700' : ''
                }`}
            >
              {isUserLoading ? (
                <div className="h-4 w-16 bg-gray-600 animate-pulse rounded inline-block mr-2"></div>
              ) : (
                user?.username
              )}
              {' - Profile'}
            </Link>
            <Link
              to="/appointments"
              className={`block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300 ${location.pathname === '/appointments' ? 'bg-gray-700' : ''
                }`}
            >
              My Appointments
            </Link>
            <button
              onClick={logout}
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