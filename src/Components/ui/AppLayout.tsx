import { Outlet } from 'react-router-dom';

import Header from '@/Components/ui/Header';

function AppLayout(): JSX.Element {
  return (
    <div>
      <Header />

      <div>
        <main>
          <Outlet />
        </main>
      </div>

      {/* <CartOverview /> */}
    </div>
  );
}

export default AppLayout;
