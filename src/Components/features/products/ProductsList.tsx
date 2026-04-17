import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Product } from '@/types';

import { CATEGORY_OPTIONS, DEFAULT_CATEGORY, type ProductCategoryLabel } from '@/constants/categories';

import ProductCard from '@/components/features/products/Product';
import { getProducts } from '@/services/productsService';

function ProductsList(): JSX.Element {
  const products = useLoaderData() as Product[];
  const [activeTab, setActiveTab] = useState<ProductCategoryLabel>(DEFAULT_CATEGORY);

  const visibleProducts = products.filter((product) => product.category === activeTab);

  return (
    <div>
      <div>
        <p>
          Shop by Categories
        </p>

        <div>
          {CATEGORY_OPTIONS.map(({ label }) => (
            <p
              key={label}
              onClick={() => setActiveTab(label)}
            >
              {label}
            </p>
          ))}
        </div>
      </div>

      {/* 🔥 Corrected to map over products from the selected category */}
      <div>
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export async function loader(): Promise<Product[]> {
  const response = await getProducts();
  return response.data;
}

export default ProductsList;
