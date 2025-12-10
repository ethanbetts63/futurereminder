import { Outlet } from "react-router-dom";

/**
 * A simple layout wrapper for all user dashboard pages.
 * It provides consistent padding and structure for the main content area.
 * The main navigation is now handled globally by the NavBar component.
 */
export function UserDashboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* The specific page component (e.g., EventManagementPage) will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}