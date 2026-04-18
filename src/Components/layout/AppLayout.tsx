import { Outlet } from 'react-router-dom';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

function AppLayout(): JSX.Element {
  return (
    <div>
      <Header />

      <div>
        <main>
          <ErrorBoundary
            fallback={(error) => (
              <div>
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
