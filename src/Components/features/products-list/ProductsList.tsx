import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Product } from '@/types';

import ProductCard from '@/Components/features/products-list/Product';
import { getProductsList } from '@/Components/services/helper';

function ProductsList(): JSX.Element {
  const productsList = useLoaderData() as Record<string, Product[]>;
  const [activeTab, setActiveTab] = useState('Skin Care');

  const products = productsList[activeTab] || [];

  return (
    <div>
      <div>
        <p>
          Shop by Categories
        </p>

        <div>
          {Object.keys(productsList).map((category) => (
            <p
              key={category}
              onClick={() => setActiveTab(category)}
            >
              {category}
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
