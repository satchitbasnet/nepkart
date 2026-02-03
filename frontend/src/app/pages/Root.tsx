import { Outlet } from "react-router";
import { Header } from "@/app/components/Header";
import { Toaster } from "sonner";

export default function Root() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-orange-500"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
