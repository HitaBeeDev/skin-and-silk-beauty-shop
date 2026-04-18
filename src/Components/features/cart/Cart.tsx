import { useState } from 'react';

import { ROUTES } from '@/constants/routes';

import type { CartItem as CartItemModel } from '@/types';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import CartItem from '@/components/features/cart/CartItem';
import EmptyCart from '@/components/features/cart/EmptyCart';
import {
  clearCart,
  deleteItem,
  restoreDeletedItem,
} from '@/components/features/cart/cartSlice';
import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from '@/components/features/cart/cartSelectors';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Button from '@/components/ui/Button';
import Error from '@/components/ui/Error';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { formatCurrency } from '@/components/utils/helpers';

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const dispatch = useAppDispatch();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [recentlyRemovedItem, setRecentlyRemovedItem] = useState<CartItemModel | null>(null);
  const [isUndoToastOpen, setIsUndoToastOpen] = useState(false);

  function handleRemoveItem(product: CartItemModel): void {
    dispatch(deleteItem(product.productId));
    setRecentlyRemovedItem(product);
    setIsUndoToastOpen(true);
  }

  function handleUndoRemove(): void {
    if (!recentlyRemovedItem) return;

    dispatch(restoreDeletedItem(recentlyRemovedItem));
    setIsUndoToastOpen(false);
    setRecentlyRemovedItem(null);
  }

  if (isCartEmpty) return <EmptyCart />;

  return (
    <ErrorBoundary
      fallback={(error) => (
        <Error message={error.message || 'The cart could not be rendered.'} />
      )}
      resetKey={`${cart.length}-${cart.map((item) => item.productId).join(',')}`}
    >
      <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
              Cart
            </p>
            <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
              Your Shopping Bag
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:items-start">
            <div className="overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white shadow-[0_24px_60px_-44px_rgba(36,25,21,0.38)]">
              <ul>
                {cart.map((product: CartItemModel) => (
                  <li key={product.productId}>
                    <CartItem onRemove={handleRemoveItem} product={product} />
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
                <div className="space-y-4">
                  <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                    Order Summary
                  </p>

                  <div className="flex items-center justify-between border-t border-[#ead9ca] pt-4 text-lg font-semibold text-[#241915]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalCartPrice)}</span>
                  </div>

                  <p className="rounded-2xl bg-[#f6e6da] px-4 py-3 text-sm leading-6 text-[#5b463d]">
                    Free shipping on all orders.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 lg:items-end">
                  <Button
                    className="w-full lg:min-w-[16rem] lg:w-auto"
                    size="lg"
                    to={ROUTES.CREATE_ORDER}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => setIsClearCartModalOpen(true)}
                    type="button"
                    variant="ghost"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <Modal
          onClose={() => setIsClearCartModalOpen(false)}
          open={isClearCartModalOpen}
        >
          <Modal.Header>
            <h2 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
              Remove all items from your cart?
            </h2>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm leading-7 text-[#5b463d]">
              This will clear your bag and remove every product from the order summary.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => setIsClearCartModalOpen(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch(clearCart());
                setIsClearCartModalOpen(false);
              }}
              type="button"
              variant="danger"
            >
              Clear Cart
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast
          duration={4000}
          message={(
            <div className="flex items-center gap-3">
              <span>{recentlyRemovedItem?.name ?? 'Item'} removed.</span>
              <button
                className="rounded-md px-2 py-1 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                onClick={handleUndoRemove}
                type="button"
              >
                Undo
              </button>
            </div>
          )}
          onClose={() => {
            setIsUndoToastOpen(false);
            setRecentlyRemovedItem(null);
          }}
          open={isUndoToastOpen}
          position="bottom-right"
          tone="info"
        />
      </section>
    </ErrorBoundary>
  );
}

export default Cart;
