import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ArrowUpRight, Minus, Plus } from "lucide-react";

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
  const heroEyebrow = productDetails?.size
    ? `${product.category} · ${productDetails.size}`
    : product.category;
  const quickFacts = [
    product.isNew ? "Fresh arrival" : null,
    product.topSeller ? "Top seller" : null,
    product.featured ? "Editor pick" : null,
    productDetails?.size ?? null,
  ].filter(Boolean) as string[];

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
    <section className="mx-auto mt-6 w-[min(100%-2rem,72rem)] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[1.1rem] bg-[#fff0f2] p-5 sm:p-7 md:p-9">
        <div className="flex flex-col gap-3">
          <Breadcrumb
            items={[
              { label: "Home", to: ROUTES.HOME },
              { label: "Products", to: ROUTES.PRODUCTS },
              { label: product.category, to: productCategoryHref },
              { label: product.name },
            ]}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[1.1rem] bg-white shadow-[0_24px_60px_rgba(85,0,0,0.12)]">
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  {product.isNew ? <Badge tone="accent">New</Badge> : null}
                  <Badge
                    className="bg-white/90 text-[#8c1d40]"
                    tone={isSoldOut ? "danger" : "success"}
                  >
                    {isSoldOut ? "Sold Out" : "In Stock"}
                  </Badge>
                </div>

                <div className="relative aspect-[5/5] bg-[#fff7f8] sm:aspect-[4/4.6]">
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

              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((image, index) => {
                  const isActive = image === selectedImage;

                  return (
                    <button
                      key={image}
                      aria-label={`Show image ${index + 1} of ${product.name}`}
                      className={[
                        "shrink-0 overflow-hidden rounded-[1rem] border bg-white shadow-[0_14px_32px_rgba(85,0,0,0.08)] transition-all duration-150 ease-in",
                        isActive
                          ? "border-[#8c1d40] ring-2 ring-[#8c1d40]/10"
                          : "border-[#8c1d40]/10 hover:border-[#8c1d40]/35",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40]/25",
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

            <div className="flex flex-col gap-5">
              <div className="rounded-[1.1rem] bg-[#550000] p-5 text-[#fff0f0] sm:p-7">
                <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#ffcad4]">
                  {heroEyebrow}
                </p>
                <h1 className="mt-3 font-['Playfair_Display',serif] text-[2.2rem] leading-[0.96] text-white sm:text-[3rem]">
                  {product.name}
                </h1>
                {productDetails?.subtitle ? (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#ffe3e7] sm:text-base">
                    {productDetails.subtitle}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-2">
                  {quickFacts.map((fact) => (
                    <span
                      key={fact}
                      className="inline-flex min-h-[2rem] items-center rounded-full border border-white/25 px-4 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-[#fff0f0]"
                    >
                      {fact}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-end gap-3">
                  <p className="text-3xl font-semibold text-white sm:text-4xl">
                    {formatCurrency(productPrice)}
                  </p>
                  {product.compareAtPrice ? (
                    <p className="pb-1 text-base text-[#ffcad4]/80 line-through sm:text-lg">
                      {formatCurrency(product.compareAtPrice)}
                    </p>
                  ) : null}
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-[minmax(0,8.2rem)_minmax(0,1fr)] sm:items-center">
                  <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10">
                    <button
                      aria-label="Decrease quantity"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors duration-150 ease-in hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      type="button"
                    >
                      <Minus size={16} strokeWidth={2.1} />
                    </button>
                    <span className="min-w-[2.8rem] text-center text-sm font-semibold text-white">
                      {quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors duration-150 ease-in hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      onClick={() => setQuantity((current) => current + 1)}
                      type="button"
                    >
                      <Plus size={16} strokeWidth={2.1} />
                    </button>
                  </div>

                  <Button
                    className={[
                      "w-full rounded-full border-0 bg-white text-[#8c1d40] shadow-[0_18px_36px_rgba(0,0,0,0.14)] hover:bg-[#fff3f5]",
                      isCartFlashActive
                        ? "bg-[#ffd9e2] text-[#5c0120]"
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

                <div className="mt-6 flex items-center gap-3 text-sm text-[#ffe3e7]">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <ArrowUpRight size={16} strokeWidth={2.1} />
                  </span>
                  <p className="leading-6">
                    Cart updates instantly, so you can keep building your routine
                    without interrupting the flow.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.1rem] bg-white p-5 text-[#241915] shadow-[0_18px_45px_rgba(85,0,0,0.08)] sm:p-7">
                <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
                  Product Overview
                </p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#5b463d] sm:text-[0.95rem]">
                  <p>{product.description}</p>
                  {productDetails?.overview ? (
                    <p>{productDetails.overview}</p>
                  ) : (
                    <p>
                      Layer it into your ritual for a finish that feels treated,
                      polished, and unmistakably elevated from the first
                      application.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.1rem] bg-white p-5 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
                  <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                    Category
                  </p>
                  <p className="mt-3 font-['Playfair_Display',serif] text-[1.25rem] text-[#5c0120]">
                    {product.category}
                  </p>
                </div>

                <div className="rounded-[1.1rem] bg-white p-5 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
                  <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                    Format
                  </p>
                  <p className="mt-3 font-['Playfair_Display',serif] text-[1.25rem] text-[#5c0120]">
                    {productDetails?.size ?? "Luxury treatment"}
                  </p>
                </div>

                <div className="rounded-[1.1rem] bg-white p-5 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
                  <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                    Availability
                  </p>
                  <p className="mt-3 font-['Playfair_Display',serif] text-[1.25rem] text-[#5c0120]">
                    {isSoldOut ? "Sold out" : "Ready to ship"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {productDetails ? (
        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          {productDetails.mainBenefits?.length ? (
            <div className="rounded-[1.1rem] bg-[#fff0f2] p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
                Main Benefits
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5b463d] sm:text-base">
                {productDetails.mainBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a70a3f]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.additionalBenefits?.length ? (
            <div className="rounded-[1.1rem] bg-[#fff0f2] p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
                Additional Benefits
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5b463d] sm:text-base">
                {productDetails.additionalBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a70a3f]" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.statistics?.length ? (
            <div className="rounded-[1.1rem] bg-[#fff0f2] p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
                Clinical Notes
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5b463d] sm:text-base">
                {productDetails.statistics.map((statistic) => (
                  <li key={statistic} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a70a3f]" />
                    <span>{statistic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {productDetails.usage?.length ? (
            <div className="rounded-[1.1rem] bg-[#fff0f2] p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
                How To Use
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-[#5b463d] sm:text-base">
                {productDetails.usage.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#8c1d40]">
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
        <section className="mt-16 rounded-[1.1rem] bg-white p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
          <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
            Key Ingredients
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5b463d] sm:text-base">
            {productDetails.ingredientHighlights.map((ingredient) => (
              <li key={ingredient} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a70a3f]" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {productDetails?.inci ? (
        <section className="mt-16 rounded-[1.1rem] bg-white p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
          <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
            INCI
          </p>
          <p className="mt-4 break-words text-sm leading-7 text-[#5b463d]">
            {productDetails.inci}
          </p>
        </section>
      ) : null}

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
              You May Also Like
            </p>
            <h2 className="mt-2 font-['Playfair_Display',serif] text-3xl text-[#5c0120]">
              More from {product.category}
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-[#8c1d40] transition-colors duration-150 ease-in hover:text-[#5c0120] hover:underline"
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
