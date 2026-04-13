import plus from '../../../assets/plus.svg';

import type { Product as ProductModel } from '@/types';

import { productsList } from '../../services/data';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addItem, getCurrentQuantityById } from '../cart/cartSlice';

type ProductProps = {
  productId: ProductModel['id'];
};

function Product({ productId }: ProductProps): JSX.Element | null {
  const dispatch = useAppDispatch();

  const allProducts = Object.values(productsList).flat();
  const product = allProducts.find((p) => p.id === productId);

  const currentQuantity = useAppSelector(
    getCurrentQuantityById(product?.id ?? 0)
  );

  if (!product) return null;

  const { id, name, unitPrice, soldOut, mainImage, description } = product;
  const productUnitPrice = unitPrice ?? product.price;

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: id,
        name,
        quantity: 1,
        unitPrice: productUnitPrice,
        totalPrice: productUnitPrice,
        mainImage,
      })
    );
  }

  return (
    <>
      <div className="h-[23rem] rounded-xl shadow-sm p-5 flex flex-col justify-between ite cursor-pointer group relative">
        <div className="flex justify-center items-center flex-grow">
          <div className="w-[14rem] h-[14rem] flex justify-center items-center">
            <img
              src={mainImage}
              alt={name}
              className={`object-contain w-full h-full ${
                soldOut ? "opacity-70 grayscale" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between h-full">
          <p className="font-['Quicksand'] text-[0.9rem] text-[#5A4034] font-semibold">
            {name}
          </p>

          <p className="text-[0.75rem] text-[#5A4034] font-normal pt-1 flex-grow">
            {description}
          </p>

          <div className="mt-auto">
            {!soldOut ? (
              <p className="text-[0.9rem] text-[#5A4034] font-semibold mt-1">
                €{productUnitPrice.toFixed(2)}
              </p>
            ) : (
              <p className="text-[0.9rem] text-[#D4B189] font-semibold">
                Sold out
              </p>
            )}

            {!soldOut && (
              <div
                className="absolute top-4 right-4 bg-[#F6E6DA] rounded-md w-7 h-7 flex justify-center items-center
                 hover:bg-[#e2ad8f] transition-all duration-500 md:opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <img src={plus} alt="plus" className="w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
