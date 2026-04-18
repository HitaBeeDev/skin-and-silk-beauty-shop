import type { Meta, StoryObj } from '@storybook/react-vite';

import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ['primary', 'secondary', 'ghost', 'danger', 'link'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export const VariantAndSizeMatrix: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div className="grid gap-6">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6659]">
            {variant}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((size) => (
              <Button key={`${variant}-${size}`} size={size} variant={variant}>
                {variant} {size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const LinkButtonStory: Story = {
  args: {
    children: 'Shop the collection',
  },
  render: () => (
    <Button size="lg" to={ROUTES.PRODUCTS} variant="primary">
      Shop the collection
    </Button>
  ),
};

export const LoadingState: Story = {
  args: {
    children: 'Loading',
  },
  render: () => (
    <div className="flex gap-3">
      <Button loading variant="primary">
        Saving
      </Button>
      <Button loading variant="secondary">
        Loading
      </Button>
    </div>
  ),
};
