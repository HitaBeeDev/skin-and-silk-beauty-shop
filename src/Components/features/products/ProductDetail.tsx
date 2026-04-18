import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

import { CATEGORY_SLUG_BY_LABEL } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";

import { addItem } from "@/components/features/cart/cartSlice";
import ProductCard from "@/components/features/products/Product";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { formatCurrency } from "@/components/utils/helpers";
import type { ProductDetailLoaderData } from "@/routes/productDetail.loader";
import { useAppDispatch } from "@store/hooks";

function ProductDetail(): JSX.Element {
  const { product, relatedProducts } =
    useLoaderData() as ProductDetailLoaderData;
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isAddedToastOpen, setIsAddedToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [selectedImage, setSelectedImage] = useState(
    product.mainImage ?? product.images.main,
  );
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isCartFlashActive, setIsCartFlashActive] = useState(false);

  const galleryImages = useMemo(
    () =>
      Array.from(
        new Set([
          product.mainImage ?? product.images.main,
          product.images.hover,
          ...product.images.gallery,
        ]),
      ).filter(Boolean),
    [
      product.images.gallery,
      product.images.hover,
      product.images.main,
      product.mainImage,
    ],
  );

  const productPrice = product.unitPrice ?? product.price;
  const isSoldOut = product.soldOut ?? !product.inStock;
  const productCategoryHref = `${ROUTES.PRODUCTS}?category=${CATEGORY_SLUG_BY_LABEL[product.category]}`;
  const productDetails = product.details;

  useEffect(() => {
    if (!previousImage) return;

    const timeoutId = window.setTimeout(() => {
      setPreviousImage(null);
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [previousImage]);

  useEffect(() => {
    if (!isCartFlashActive) return;

    const timeoutId = window.setTimeout(() => {
      setIsCartFlashActive(false);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [isCartFlashActive]);

  function handleImageChange(nextImage: string): void {
    if (nextImage === selectedImage) return;

    setPreviousImage(selectedImage);
    setSelectedImage(nextImage);
    setIsImageVisible(false);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsImageVisible(true);
      });
    });
  }

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: productPrice,
        totalPrice: productPrice * quantity,
        mainImage: product.mainImage ?? product.images.main,
      }),
    );
    setToastKey((current) => current + 1);
    setIsAddedToastOpen(true);
    setIsCartFlashActive(true);
  }

  return (
    <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", to: ROUTES.HOME },
          { label: "Products", to: ROUTES.PRODUCTS },
          { label: product.category, to: productCategoryHref },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#fbf3ec] shadow-[0_28px_70px_-42px_rgba(36,25,21,0.38)]">
            <div className="relative aspect-[4/5]">
              {previousImage ? (
                <img
                  aria-hidden="true"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-150 ease-in"
                  src={previousImage}
                />
              ) : null}
              <img
                alt={`${product.name} product in ${product.category.toLowerCase()} packaging`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ease-in ${isImageVisible ? "opacity-100" : "opacity-0"}`}
                src={selectedImage}
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => {
              const isActive = image === selectedImage;

              return (
                <button
                  key={image}
                  aria-label={`Show image ${index + 1} of ${product.name}`}
                  className={[
                    "shrink-0 overflow-hidden rounded-2xl border-2 bg-[#fbf3ec] transition-colors duration-150 ease-in",
                    isActive ? "border-[#5a4034]" : "border-transparent",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
                  ].join(" ")}
                  onClick={() => handleImageChange(image)}
                  type="button"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-24 w-20 object-cover"
                    src={image}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
              {product.category}
            </p>
            <h1 className="font-['Playfair_Display',serif] text-4xl leading-tight text-[#5a4034] sm:text-5xl">
              {product.name}
            </h1>
            {productDetails?.subtitle ? (
              <p className="font-['Quicksand',sans-serif] text-base text-[#6b5248] sm:text-lg">
                {productDetails.subtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-3xl font-semibold text-[#241915]">
                {formatCurrency(productPrice)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-lg text-[#8c6659] line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              ) : null}
              {productDetails?.size ? (
                <p className="rounded-full bg-[#f6e8dd] px-3 py-1 text-sm font-medium text-[#7b584c]">
                  {productDetails.size}
                </p>
              ) : null}
            </div>
            <div>
              <Badge
                className="px-3 py-1 text-sm"
                tone={isSoldOut ? "danger" : "success"}
              >
                {isSoldOut ? "Sold Out" : "In Stock"}
              </Badge>
            </div>
            <div className="space-y-4 font-['Quicksand',sans-serif] text-base leading-8 text-[#4d3932]">
              <p>{product.description}</p>
              {productDetails?.overview ? (
                <p>
                  {productDetails.overview}
                </p>
              ) : (
                <p>
                  Layer it into your ritual for a finish that feels treated,
                  polished, and unmistakably elevated from the first
                  application.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5 rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-[#d9c0ae] bg-white">
                <button
                  aria-label="Decrease quantity"
                  className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#5a4034] transition-colors duration-150 ease-in hover:bg-[#f8efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  type="button"
                >
                  −
                </button>
                <span className="min-w-[3rem] text-center font-semibold text-[#241915]">
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#5a4034] transition-colors duration-150 ease-in hover:bg-[#f8efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  +
                </button>
              </div>

              <Button
                className={[
                  "min-w-[14rem] active:scale-[0.97]",
                  isCartFlashActive
                    ? "border-green-600 bg-green-600 text-white"
                    : "",
                ].join(" ")}
                disabled={isSoldOut}
                onClick={handleAddToCart}
                size="lg"
                type="button"
              >
                {isSoldOut ? "Currently Sold Out" : `Add ${quantity} to Cart`}
              </Button>
            </div>
            <p className="font-['Quicksand',sans-serif] text-sm leading-6 text-[#6a5147]">
              Cart updates instantly, so you can keep building your routine
              without waiting on a blocking state.
            </p>
          </div>
        </div>
      </div>

      {productDetails ? (
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          {productDetails.mainBenefits?.length ? (
            <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
              <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                Main Benefits
              </p>
              <ul className="mt-4 space-y-3 font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932] sm:text-base">
                {productDetails.mainBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8c6659]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.additionalBenefits?.length ? (
            <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
              <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                Additional Benefits
              </p>
              <ul className="mt-4 space-y-3 font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932] sm:text-base">
                {productDetails.additionalBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8c6659]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.statistics?.length ? (
            <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
              <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                Clinical Notes
              </p>
              <ul className="mt-4 space-y-3 font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932] sm:text-base">
                {productDetails.statistics.map((statistic) => (
                  <li key={statistic} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8c6659]" />
                    <span>{statistic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.usage?.length ? (
            <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
              <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                How To Use
              </p>
              <ol className="mt-4 space-y-3 font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932] sm:text-base">
                {productDetails.usage.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3dfd1] text-xs font-semibold text-[#7b584c]">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}

      {productDetails?.ingredientHighlights?.length ? (
        <section className="mt-16 rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
          <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
            Key Ingredients
          </p>
          <ul className="mt-4 space-y-3 font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932] sm:text-base">
            {productDetails.ingredientHighlights.map((ingredient) => (
              <li key={ingredient} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8c6659]" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {productDetails?.inci ? (
        <section className="mt-16 rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]">
          <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
            INCI
          </p>
          <p className="mt-4 break-words font-['Quicksand',sans-serif] text-sm leading-7 text-[#4d3932]">
            {productDetails.inci}
          </p>
        </section>
      ) : null}

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
              You May Also Like
            </p>
            <h2 className="mt-2 font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
              More from {product.category}
            </h2>
          </div>
          <Link
            className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034] transition-colors duration-150 ease-in hover:text-[#3f2d25] hover:underline"
            to={productCategoryHref}
          >
            View All {product.category}
          </Link>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex snap-x snap-mandatory gap-6 lg:grid lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="w-[18rem] shrink-0 snap-start lg:w-auto"
              >
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Toast
        key={toastKey}
        duration={2000}
        isOpen={isAddedToastOpen}
        message={`${quantity} ${product.name} added to cart.`}
        onClose={() => setIsAddedToastOpen(false)}
        position="top-right"
        tone="success"
      />
    </section>
  );
}

export default ProductDetail;
