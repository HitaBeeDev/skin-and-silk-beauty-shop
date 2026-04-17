import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Product } from '@/types';

import { CATEGORY_OPTIONS, DEFAULT_CATEGORY, type ProductCategoryLabel } from '@/constants/categories';

import ProductCard from '@/components/features/products/Product';
import { getProductsList } from '@/components/services/helper';

function ProductsList(): JSX.Element {
  const productsList = useLoaderData() as Record<string, Product[]>;
  const [activeTab, setActiveTab] = useState<ProductCategoryLabel>(DEFAULT_CATEGORY);

  const products = productsList[activeTab] || [];

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
        {products.map((product) => (
          <ProductCard productId={product.id} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export async function loader(): Promise<Record<string, Product[]>> {
  const productsList = await getProductsList();
  return productsList;
}

export default ProductsList;
