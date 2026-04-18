import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import type { CartItem as CartItemModel } from '@/types';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import CartItem from '@/components/features/cart/CartItem';
import EmptyCart from '@/components/features/cart/EmptyCart';
import { clearCart } from '@/components/features/cart/cartSlice';
import { getCart, getIsCartEmpty } from '@/components/features/cart/cartSelectors';
import CartSkeleton from '@/components/ui/CartSkeleton';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Error from '@/components/ui/Error';
import Modal from '@/components/ui/Modal';

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const dispatch = useAppDispatch();
  const [isHydrating, setIsHydrating] = useState(true);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

  useEffect(() => {
    const hydrationFrame = window.requestAnimationFrame(() => {
      setIsHydrating(false);
    });

    return () => window.cancelAnimationFrame(hydrationFrame);
  }, []);

  if (isHydrating) return <CartSkeleton />;

  if (isCartEmpty) return <EmptyCart />;

  return (
    <ErrorBoundary
      fallback={(error) => (
        <Error
          message={error.message || 'The cart could not be rendered.'}
        />
      )}
      resetKey={`${cart.length}-${cart.map((item) => item.productId).join(',')}`}
    >
      <div>
        <p>
          Your Shopping Basket
        </p>

        <div>
          <ul>
            {cart.map((product: CartItemModel) => (
              <li
                key={product.productId}
              >
                <CartItem product={product} />
              </li>
            ))}
          </ul>

          <div>
            <div>
              <Link to={ROUTES.PRODUCTS}>
                <button
                >
                  Return to Menu
                </button>
              </Link>
              <button
                onClick={() => setIsClearCartModalOpen(true)}
              >
                Remove All Items
              </button>
            </div>

            <div>
              <div
              >
                <Link
                  to={ROUTES.CREATE_ORDER}
                >
                  Order
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Modal
          onClose={() => setIsClearCartModalOpen(false)}
          open={isClearCartModalOpen}
        >
          <Modal.Header>
            <h2>Clear cart?</h2>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure? This will remove all items.</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => setIsClearCartModalOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dispatch(clearCart());
                setIsClearCartModalOpen(false);
              }}
              type="button"
            >
              Clear cart
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

export default Cart;
