import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import '../src/tailwind.css';
import { clearCart } from '../src/components/features/cart/cartSlice';
import store from '../src/store';

const preview: Preview = {
  decorators: [
    (Story) => {
      store.dispatch(clearCart());

      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ee_100%)] p-6 text-[#241915]">
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
