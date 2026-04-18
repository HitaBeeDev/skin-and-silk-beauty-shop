import type { Meta, StoryObj } from '@storybook/react-vite';

import EmptyCart from '@/components/features/cart/EmptyCart';

const meta = {
  title: 'Commerce/EmptyCart',
  component: EmptyCart,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EmptyCart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
