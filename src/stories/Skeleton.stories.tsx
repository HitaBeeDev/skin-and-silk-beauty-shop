import type { Meta, StoryObj } from "@storybook/react-vite";

import Skeleton from "@/components/ui/Skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductCardShape: Story = {
  render: () => (
    <div className="w-[18rem] overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-3 px-5 py-5">
        <Skeleton className="h-7 w-[72%] rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-[85%] rounded-full" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton isCircle className="h-11 w-11" />
        </div>
      </div>
    </div>
  ),
};

export const Circle: Story = {
  render: () => <Skeleton isCircle className="h-16 w-16" />,
};
