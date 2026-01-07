import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { ConfigProvider } from './context/ConfigContext';
import { Spinner } from './components/ui/spinner';

// --- Lazy-loaded Pages ---
const ConfirmationPage = lazy(() => import('./pages/flow/ConfirmationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboardLayout = lazy(() => import('./pages/UserDashboardLayout'));
const EventManagementPage = lazy(() => import('./pages/EventManagementPage'));
const AccountManagementPage = lazy(() => import('./pages/AccountManagementPage'));
const EventGate = lazy(() => import('@/components/EventGate'));
const ProfileCreationPage = lazy(() => import('./pages/flow/ProfileCreationPage'));
const EmergencyContactPage = lazy(() => import('./pages/flow/EmergencyContactPage'));
const EventCreationPage = lazy(() => import('./pages/flow/EventCreationPage'));
const TierChoicePage = lazy(() => import('./pages/flow/TierChoicePage'));
const ActivationSuccessPage = lazy(() => import('./pages/flow/ActivationSuccessPage'));
const PaymentPage = lazy(() => import('./pages/flow/PaymentPage'));
const PaymentStatusPage = lazy(() => import('./pages/flow/PaymentStatusPage'));
const VerificationSuccessPage = lazy(() => import('./pages/flow/VerificationSuccessPage'));
const BlocklistSuccessPage = lazy(() => import('./pages/flow/BlocklistSuccessPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordConfirmPage = lazy(() => import('./pages/ResetPasswordConfirmPage'));

// --- Lazy-loaded Admin Pages ---
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage'));
const AutomatedNotificationsPage = lazy(() => import('./pages/admin/AutomatedNotificationsPage'));
const ManualNotificationsPage = lazy(() => import('./pages/admin/ManualNotificationsPage'));

// --- Lazy-loaded Articles ---
const LetterToFutureSelf = lazy(() => import('./pages/articles/LetterToFutureSelf'));
const VaccineBoosters = lazy(() => import('./pages/articles/VaccineBoosters'));
const IUDExpiration = lazy(() => import('./pages/articles/IUDExpiration'));
const AnniversaryReminders = lazy(() => import('./pages/articles/AnniversaryReminders'));
const VisaExpiry = lazy(() => import('./pages/articles/VisaExpiry'));
const SubscriptionRenewal = lazy(() => import('./pages/articles/SubscriptionRenewal'));
const ReminderAppsRanked = lazy(() => import('./pages/articles/ReminderAppsRanked'));
const CaringForRosesSeasonalGuide = lazy(() => import('./pages/articles/CaringForRosesSeasonalGuide'));
const CaringForHydrangeasSeasonalGuide = lazy(() => import('./pages/articles/CaringForHydrangeasSeasonalGuide'));
const CaringForLavenderSeasonalGuide = lazy(() => import('./pages/articles/CaringForLavenderSeasonalGuide'));
const CaringForCrepeMyrtleSeasonalGuide = lazy(() => import('./pages/articles/CaringForCrepeMyrtleSeasonalGuide'));
const CaringForAzaleasSeasonalGuide = lazy(() => import('./pages/articles/CaringForAzaleasSeasonalGuide'));
const CaringForCherryTreesSeasonalGuide = lazy(() => import('./pages/articles/CaringForCherryTreesSeasonalGuide'));
const CaringForAppleTreesSeasonalGuide = lazy(() => import('./pages/articles/CaringForAppleTreesSeasonalGuide'));
const CaringForPeoniesSeasonalGuide = lazy(() => import('./pages/articles/CaringForPeoniesSeasonalGuide'));
const CaringForBlueberryBushesSeasonalGuide = lazy(() => import('./pages/articles/CaringForBlueberryBushesSeasonalGuide'));
const TaxSeason2026 = lazy(() => import('./pages/articles/TaxSeason2026'));
const BestDailyReminderApps = lazy(() => import('./pages/articles/BestDailyReminderApps'));
const BestFreeReminderApps = lazy(() => import('./pages/articles/BestFreeReminderApps'));
const BestEmailReminderApps = lazy(() => import('./pages/articles/BestEmailReminderApps'));
const BestTextMessageReminderApps = lazy(() => import('./pages/articles/BestTextMessageReminderApps'));
const BestMedicationReminderApps = lazy(() => import('./pages/articles/BestMedicationReminderApps'));
const BestBillAndSubscriptionReminderApps = lazy(() => import('./pages/articles/BestBillAndSubscriptionReminderApps'));
const BlogExplorePage = lazy(() => import('./pages/BlogExplorePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));


const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner className="h-12 w-12" />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <Toaster position="top-center" />
        <div className="flex-grow">
          <ConfigProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/confirmation/:eventId" element={<ConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/verification-success" element={<VerificationSuccessPage />} />
                <Route path="/blocklist-success" element={<BlocklistSuccessPage />} />
                <Route path="/articles/letter-to-future-self" element={<LetterToFutureSelf />} />
                <Route path="/articles/vaccine-boosters" element={<VaccineBoosters />} />
                <Route path="/articles/iud-expiration" element={<IUDExpiration />} />
                <Route path="/articles/anniversary-reminders" element={<AnniversaryReminders />} />
                <Route path="/articles/visa-expiry" element={<VisaExpiry />} />
                <Route path="/articles/subscription-renewal" element={<SubscriptionRenewal />} />
                <Route path="/articles/reminder-apps-ranked" element={<ReminderAppsRanked />} />
                <Route path="/articles/caring-for-roses-seasonal-guide" element={<CaringForRosesSeasonalGuide />} />
                <Route path="/articles/caring-for-hydrangeas-seasonal-guide" element={<CaringForHydrangeasSeasonalGuide />} />
                <Route path="/articles/caring-for-lavender-seasonal-guide" element={<CaringForLavenderSeasonalGuide />} />
                <Route path="/articles/caring-for-crepe-myrtle-seasonal-guide" element={<CaringForCrepeMyrtleSeasonalGuide />} />
                <Route path="/articles/caring-for-azaleas-seasonal-guide" element={<CaringForAzaleasSeasonalGuide />} />
                <Route path="/articles/caring-for-cherry-trees-seasonal-guide" element={<CaringForCherryTreesSeasonalGuide />} />
                <Route path="/articles/caring-for-apple-trees-seasonal-guide" element={<CaringForAppleTreesSeasonalGuide />} />
                <Route path="/articles/caring-for-peonies-seasonal-guide" element={<CaringForPeoniesSeasonalGuide />} />
                <Route path="/articles/caring-for-blueberry-bushes-seasonal-guide" element={<CaringForBlueberryBushesSeasonalGuide />} />
                <Route path="/articles/tax-season-2026" element={<TaxSeason2026 />} />
                <Route path="/articles/best-daily-reminder-apps" element={<BestDailyReminderApps />} />
                <Route path="/articles/best-free-reminder-apps" element={<BestFreeReminderApps />} />
                <Route path="/articles/best-email-reminder-apps" element={<BestEmailReminderApps />} />
                <Route path="/articles/best-text-message-reminder-apps" element={<BestTextMessageReminderApps />} />
                <Route path="/articles/best-medication-reminder-apps" element={<BestMedicationReminderApps />} />
                <Route path="/articles/best-bill-and-subscription-reminder-apps" element={<BestBillAndSubscriptionReminderApps />} />
                <Route path="/articles" element={<BlogExplorePage />} />

                {/* Event Creation Flow */}
                <Route path="/event-gate" element={<EventGate />} />
                <Route path="/create-flow/profile" element={<ProfileCreationPage />} />
                <Route path="/create-flow/contacts" element={<EmergencyContactPage />} />
                <Route path="/create-flow/event" element={<EventCreationPage />} />
                <Route path="/events/:id/activate" element={<TierChoicePage />} />
                <Route path="/create-flow/payment" element={<PaymentPage />} />
                <Route path="/create-flow/success" element={<ActivationSuccessPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Admin Section */}
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                  <Route path="notifications/automated" element={<AutomatedNotificationsPage />} />
                  <Route path="notifications/manual" element={<ManualNotificationsPage />} />
                </Route>

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<UserDashboardLayout />}>
                  <Route index element={<Navigate to="events" replace />} />
                  <Route path="events" element={<EventManagementPage />} />
                  <Route path="account" element={<AccountManagementPage />} />
                </Route>

              </Routes>
            </Suspense>
          </ConfigProvider>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;