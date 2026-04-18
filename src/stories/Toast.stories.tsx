import type { Meta, StoryObj } from "@storybook/react-vite";

import Toast from "@/components/ui/Toast";

const meta = {
  title: "UI/Toast",
  component: Toast,
  args: {
    isOpen: true,
    onClose: () => undefined,
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    tone: "success",
    message: "Added to cart.",
    position: "bottom-right",
  },
};

export const Error: Story = {
  args: {
    tone: "error",
    message: "Could not place your order.",
    position: "bottom-right",
  },
};
