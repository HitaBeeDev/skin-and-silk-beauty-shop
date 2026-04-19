import { useCallback, useState } from "react";

import type { CartItem as CartItemModel } from "@/types";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import CartHeader from "@/components/features/cart/CartHeader";
import CartItemList from "@/components/features/cart/CartItemList";
import CartSummary from "@/components/features/cart/CartSummary";
import ClearCartModal from "@/components/features/cart/ClearCartModal";
import EmptyCart from "@/components/features/cart/EmptyCart";
import UndoRemoveToast from "@/components/features/cart/UndoRemoveToast";
import {
  clearCart,
  deleteItem,
  restoreDeletedItem,
} from "@/components/features/cart/cartSlice";
import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from "@/components/features/cart/cartSelectors";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Error from "@/components/ui/Error";

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const dispatch = useAppDispatch();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [recentlyRemovedItem, setRecentlyRemovedItem] =
    useState<CartItemModel | null>(null);
  const [isUndoToastOpen, setIsUndoToastOpen] = useState(false);

  const handleRemoveItem = useCallback(
    (product: CartItemModel): void => {
      dispatch(deleteItem(product.productId));
      setRecentlyRemovedItem(product);
      setIsUndoToastOpen(true);
    },
    [dispatch],
  );

  const handleUndoRemove = useCallback((): void => {
    if (!recentlyRemovedItem) return;

    dispatch(restoreDeletedItem(recentlyRemovedItem));
    setIsUndoToastOpen(false);
    setRecentlyRemovedItem(null);
  }, [dispatch, recentlyRemovedItem]);

  const handleOpenClearCartModal = useCallback((): void => {
    setIsClearCartModalOpen(true);
  }, []);

  const handleCloseClearCartModal = useCallback((): void => {
    setIsClearCartModalOpen(false);
  }, []);

  const handleClearCart = useCallback((): void => {
    dispatch(clearCart());
    setIsClearCartModalOpen(false);
  }, [dispatch]);

  const handleCloseUndoToast = useCallback((): void => {
    setIsUndoToastOpen(false);
    setRecentlyRemovedItem(null);
  }, []);

  if (isCartEmpty) return <EmptyCart />;

  return (
    <ErrorBoundary
      fallback={(error) => (
        <Error message={error.message || "The cart could not be rendered."} />
      )}
      resetKey={`${cart.length}-${cart.map((item) => item.productId).join(",")}`}
    >
      <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <CartHeader />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:items-start">
            <CartItemList cart={cart} onRemove={handleRemoveItem} />
            <CartSummary
              onClearCart={handleOpenClearCartModal}
              totalCartPrice={totalCartPrice}
            />
          </div>
        </div>

        <ClearCartModal
          isOpen={isClearCartModalOpen}
          onClose={handleCloseClearCartModal}
          onConfirm={handleClearCart}
        />

        <UndoRemoveToast
          isOpen={isUndoToastOpen}
          itemName={recentlyRemovedItem?.name}
          onClose={handleCloseUndoToast}
          onUndo={handleUndoRemove}
        />
      </section>
    </ErrorBoundary>
  );
}

export default Cart;
