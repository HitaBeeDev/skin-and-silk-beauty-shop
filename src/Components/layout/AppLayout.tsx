import { Outlet } from 'react-router-dom';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

function AppLayout(): JSX.Element {
  return (
    <div>
      <a className="skip-link" href="#main-content">
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
