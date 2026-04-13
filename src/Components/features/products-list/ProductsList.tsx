import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Product } from '@/types';

import { getProductsList } from '../../services/helper';
import ProductCard from './Product';

function ProductsList() {
  const productsList = useLoaderData() as Record<string, Product[]>;
  const [activeTab, setActiveTab] = useState('Skin Care');

  const products = productsList[activeTab] || [];

  return (
    <div className="mt-6 md:pl-16 md:pr-16 pr-5 pl-5">
      <div className="flex flex-col justify-center items-center mt-5">
        <p className="font-['Quicksand'] text-[1.5rem] text-[#2e1f1a] font-[500] leading-[6rem] tracking-[0.15rem]">
          Shop by Categories
        </p>

        <div className="flex flex-row justify-center md:gap-28 gap-5 items-center font-['Quicksand'] font-[400] text-[0.85rem] mt-2 text-[#513a32]">
          {Object.keys(productsList).map((category) => (
            <p
              key={category}
              onClick={() => setActiveTab(category)}
              className={`cursor-pointer rounded-[1rem] h-8 w-[6.5rem] flex justify-center items-center ${
                activeTab === category
                  ? "border border-[#D4B189] font-[500]"
                  : "border border-white font-[400]"
              }`}
            >
              {category}
            </p>
          ))}
        </div>
      </div>

      {/* 🔥 Corrected to map over products from the selected category */}
      <div className="md:grid md:grid-cols-4 md:gap-6 mt-8 flex flex-col gap-5">
        {products.map((product) => (
          <ProductCard productId={product.id} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const productsList = await getProductsList();
  return productsList;
}

export default ProductsList;
