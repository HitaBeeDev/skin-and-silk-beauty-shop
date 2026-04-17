import { Outlet } from 'react-router-dom';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

function AppLayout(): JSX.Element {
  return (
    <div>
      <Header />

      <div>
        <main>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;
