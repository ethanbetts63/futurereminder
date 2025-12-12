import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home';
import ConfirmationPage from './pages/flow/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { ConfigProvider } from './context/ConfigContext';

// Import dashboard components
import { UserDashboardLayout } from './pages/UserDashboardLayout';
import { EventManagementPage } from './pages/EventManagementPage';
import AccountManagementPage from './pages/AccountManagementPage';

// Import the new event creation flow pages
import EventGate from '@/components/EventGate';
import ProfileCreationPage from './pages/flow/ProfileCreationPage';
import EmergencyContactPage from './pages/flow/EmergencyContactPage';
import EventCreationPage from './pages/flow/EventCreationPage';
import PaymentPage from './pages/flow/PaymentPage';
import PaymentStatusPage from './pages/flow/PaymentStatusPage';
import LetterToFutureSelf from './pages/articles/LetterToFutureSelf';
import VaccineBoosters from './pages/articles/VaccineBoosters';
import IUDExpiration from './pages/articles/IUDExpiration';
import AnniversaryReminders from './pages/articles/AnniversaryReminders';
import VisaExpiry from './pages/articles/VisaExpiry';
import SubscriptionRenewal from './pages/articles/SubscriptionRenewal';
import ReminderAppsRanked from './pages/articles/ReminderAppsRanked';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Toaster position="top-center" />
      <div className="flex-grow">
        <ConfigProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/confirmation/:eventId" element={<ConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/articles/letter-to-future-self" element={<LetterToFutureSelf />} />
            <Route path="/articles/vaccine-boosters" element={<VaccineBoosters />} />
            <Route path="/articles/iud-expiration" element={<IUDExpiration />} />
            <Route path="/articles/anniversary-reminders" element={<AnniversaryReminders />} />
            <Route path="/articles/visa-expiry" element={<VisaExpiry />} />
            <Route path="/articles/subscription-renewal" element={<SubscriptionRenewal />} />
            <Route path="/articles/reminder-apps-ranked" element={<ReminderAppsRanked />} />

            {/* Event Creation Flow */}
            <Route path="/event-gate" element={<EventGate />} />
            <Route path="/create-flow/profile" element={<ProfileCreationPage />} />
            <Route path="/create-flow/contacts" element={<EmergencyContactPage />} />
            <Route path="/create-flow/event" element={<EventCreationPage />} />
            <Route path="/create-flow/payment" element={<PaymentPage />} />
            <Route path="/payment-status" element={<PaymentStatusPage />} />

            {/* Logged-in user dashboard routes */}
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<EventManagementPage />} />
              <Route path="account" element={<AccountManagementPage />} />
            </Route>

          </Routes>
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;

