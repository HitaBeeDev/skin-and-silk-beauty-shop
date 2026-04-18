import type { Meta, StoryObj } from '@storybook/react-vite';

import type { Product } from '@/types';

import ProductCard from '@/components/features/products/Product';
import product1 from '@/assets/Products/product1.png';
import product2 from '@/assets/Products/product2.avif';
import product5 from '@/assets/Products/product5.jpg';
import product6 from '@/assets/Products/product6.webp';
import product7 from '@/assets/Products/product7.png';

const baseProduct: Product = {
  id: 'story-1',
  sku: 'STORY-1',
  name: 'Hydro-Softening Lotion N',
  slug: 'hydro-softening-lotion-n',
  category: 'Skin Care',
  featured: false,
  price: 345,
  compareAtPrice: 395,
  description: 'A lotion that delivers deep hydration and a radiant finish.',
  images: {
    main: product1,
    hover: product2,
    gallery: [product1, product2],
  },
  inStock: true,
  isNew: false,
  tags: ['hydrating'],
  unitPrice: 345,
  soldOut: false,
  mainImage: product1,
};

const meta = {
  title: 'Commerce/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => <div className="w-[18rem]"><Story /></div>,
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InStock: Story = {
  args: {
    product: baseProduct,
  },
};

export const SoldOut: Story = {
  args: {
    product: {
      ...baseProduct,
      id: 'story-2',
      soldOut: true,
      inStock: false,
      mainImage: product5,
      images: {
        main: product5,
        hover: product5,
        gallery: [product5],
      },
    },
  },
};

export const NewArrival: Story = {
  args: {
    product: {
      ...baseProduct,
      id: 'story-3',
      isNew: true,
      mainImage: product6,
      images: {
        main: product6,
        hover: product7,
        gallery: [product6, product7],
      },
    },
  },
};

export const FeaturedPick: Story = {
  args: {
    product: {
      ...baseProduct,
      id: 'story-4',
      featured: true,
      name: 'Future Skin Gel Foundation',
      price: 150,
      unitPrice: 150,
      description: 'A lightweight gel foundation with buildable coverage and skincare benefits.',
      mainImage: product6,
      images: {
        main: product6,
        hover: product7,
        gallery: [product6, product7],
      },
    },
  },
};
