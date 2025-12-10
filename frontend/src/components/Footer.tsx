import React from 'react';
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
            <a href="/privacy" className="text-sm hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-sm hover:underline">Terms of Service</a>
            <a href="/contact" className="text-sm hover:underline">Contact</a>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
