import type { Product } from "@/types";

import ProductCard from "@/components/features/products/Product";

type ProductGridProps = {
  products: Product[];
};

function ProductGrid({ products }: ProductGridProps): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
