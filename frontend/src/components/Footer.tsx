import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          {/* Left Side: Logo and Copyright */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img src={logo} alt=" Logo" className="h-8 w-auto" />
            <p className="text-sm">&copy; {currentYear} FutureReminder. All rights reserved.</p>
          </div>

          {/* Right Side: Navigation Links */}
          <nav className="flex gap-6">
            <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-sm hover:underline">Terms & Conditions</Link>
            <Link to="/contact" className="text-sm hover:underline">Contact</Link>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;