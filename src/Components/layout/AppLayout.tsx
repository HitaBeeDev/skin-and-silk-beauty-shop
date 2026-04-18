import { Outlet } from "react-router-dom";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

function AppLayout(): JSX.Element {
  return (
    <div className="mr-30 ml-30 mt-7 mb-10">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1001] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-gray-900"
        href="#main-content"
      >
        Skip to content
      </a>

      <Header />

      <div>
        <main id="main-content">
          <ErrorBoundary
            fallback={(error) => (
              <div role="alert">
                <h1>Something went wrong.</h1>
                <p>{error.message}</p>
              </div>
            )}
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;
