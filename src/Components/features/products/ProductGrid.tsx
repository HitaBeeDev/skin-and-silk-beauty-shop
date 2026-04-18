import type { Product } from '@/types';

import ProductCard from '@/components/features/products/Product';

type ProductGridProps = {
  products: Product[];
};

function ProductGrid({ products }: ProductGridProps): JSX.Element {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
