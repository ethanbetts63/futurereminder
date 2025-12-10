import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import logo from '../assets/logo.webp';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook

const NavBar: React.FC = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        
        {/* Left Section: Logo and App Name */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt=" Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="font-bold text-xl hidden md:block bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold underline italic">FutureReminder</span>
          </Link>
        </div>

        {/* Center Section: Can be used for nav links later */}
        <nav className="flex-1 flex justify-center gap-4">
        </nav>

        {/* Right Section: Auth Buttons */}
        <div className="flex items-center justify-end gap-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard/events')}>
                My Events
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard/account')}>
                Account
              </Button>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/event-gate">
                <Button>Create Event</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
