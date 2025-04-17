import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
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
          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className="py-4 px-3 hover:bg-gray-700 transition duration-300 rounded">Home</a>
            <a href="/register" className="py-4 px-3 hover:bg-gray-700 transition duration-300 rounded">Register</a>
            <a href="/profile" className="py-4 px-3 hover:bg-gray-700 transition duration-300 rounded">Profile</a>
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
        <a href="/" className="block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300">Home</a>
        <a href="/register" className="block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300">Register</a>
        <a href="/profile" className="block py-2 px-4 text-sm hover:bg-gray-700 transition duration-300">Profile</a>
      </div>
    </nav>
  );
};

export default Navbar;