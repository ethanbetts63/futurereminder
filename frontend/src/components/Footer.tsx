import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import logo320 from '../assets/logo-320w.webp';
import logo640 from '../assets/logo-640w.webp';
import logo768 from '../assets/logo-768w.webp';
import logo1024 from '../assets/logo-1024w.webp';
import logo1280 from '../assets/logo-1280w.webp';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          {/* Left Side: Logo and Copyright */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <img
                                width="367"
                                height="367"
                                className="h-10 w-auto"
                                src={logo}
                                srcSet={`${logo320} 320w, ${logo640} 640w, ${logo768} 768w, ${logo1024} 1024w, ${logo1280} 1280w`}
                                sizes="40px"
                                alt="Future Reminder Logo"
                            />
            <p className="text-sm">&copy; {currentYear} FutureReminder. All rights reserved.</p>
          </div>

          {/* Right Side: Navigation Links */}
          <nav className="flex gap-6">
            <Link to="/terms-and-conditions" className="text-sm hover:underline">Terms & Conditions</Link>
          </nav>

        </div>
      </div>
    </footer>
  );
};

export default Footer;