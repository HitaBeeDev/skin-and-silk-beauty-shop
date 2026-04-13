import { Outlet } from 'react-router-dom';

import Header from './Header';

function AppLayout() {
  return (
    <div className="bg-[#FFFFFF] h-screen flex flex-col">
      <Header />

      <div className="flex-grow">
        <main className="h-full">
          <Outlet />
        </main>
      </div>

      {/* <CartOverview /> */}
    </div>
  );
}

export default AppLayout;
