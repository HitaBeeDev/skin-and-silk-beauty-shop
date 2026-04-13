import type { Order, Product } from '@/types';

import HYDROSOFTENINGLOTIONN1 from "../../assets/Products/product1.png";
import product7 from "../../assets/Products/product7.png";
import product8 from "../../assets/Products/product8.png";
import product9 from "../../assets/Products/product9.png";
import product10 from "../../assets/Products/product10.png";
import product11 from "../../assets/Products/product11.png";
import product12 from "../../assets/Products/product12.png";
import product23 from "../../assets/Products/product23.png";
import product24 from "../../assets/Products/product24.png";
import TheNEWTheRejuvenatingNightCream1 from "../../assets/Products/product2.avif";
import product13 from "../../assets/Products/product13.avif";
import product14 from "../../assets/Products/product14.avif";
import product15 from "../../assets/Products/product15.avif";
import product16 from "../../assets/Products/product16.avif";
import TheRichCream from "../../assets/Products/product3.webp";
import product19 from "../../assets/Products/product19.webp";
import product6 from "../../assets/Products/product6.webp";
import product20 from "../../assets/Products/product20.webp";
import product21 from "../../assets/Products/product21.webp";
import product22 from "../../assets/Products/product22.webp";
import product4 from "../../assets/Products/product4.jpg";
import product5 from "../../assets/Products/product5.jpg";
import product17 from "../../assets/Products/product17.jpg";
import product18 from "../../assets/Products/product18.jpg";

export type ProductsByCategory = Record<string, Product[]>;

export const productsList: ProductsByCategory = {
  "Skin Care": [
    {
      id: 1,
      sku: 'SKU-1',
      name: "HYDRO-SOFTENING LOTION N",
      category: 'Skin Care',
      price: 345,
      unitPrice: 345,
      description:
        "A lotion that enhances skin intelligence, delivering deep hydration, preventing dryness, and revitalizing with a radiant glow.",
      inStock: true,
      soldOut: false,
      images: { main: HYDROSOFTENINGLOTIONN1 },
      mainImage: HYDROSOFTENINGLOTIONN1,
    },
    {
      id: 2,
      sku: 'SKU-2',
      name: "The NEW The Rejuvenating Night Cream",
      category: 'Skin Care',
      price: 120,
      unitPrice: 120,
      description:
        "Total rejuvenation starts tonight. The NEW Rejuvenating Night Cream reduces the 8 main signs of visible skin aging in just 1 night.",
      inStock: true,
      soldOut: false,
      images: { main: TheNEWTheRejuvenatingNightCream1 },
      mainImage: TheNEWTheRejuvenatingNightCream1,
    },
    {
      id: 3,
      sku: 'SKU-3',
      name: "The Rich Cream",
      category: 'Skin Care',
      price: 480,
      unitPrice: 480,
      description:
        "The particularly rich, hydrating and nourishing cream dramatically improves cell regeneration and the appearance of the complexion.",
      inStock: true,
      soldOut: false,
      images: { main: TheRichCream },
      mainImage: TheRichCream,
    },
    {
      id: 4,
      sku: 'SKU-4',
      name: "SUPER ANTI-AGING DUAL SERUM",
      category: 'Skin Care',
      price: 225,
      unitPrice: 225,
      description:
        "A 2-phase serum combining anti-aging power with a ceramide-peptide complex for hydration, barrier support, and lasting radiance.",
      inStock: true,
      soldOut: false,
      images: { main: product4 },
      mainImage: product4,
    },
    {
      id: 13,
      sku: 'SKU-13',
      name: "Crème de la Mer",
      category: 'Skin Care',
      price: 105,
      unitPrice: 105,
      description: "Restores dryness with deep hydration.",
      inStock: false,
      soldOut: true,
      images: { main: product13 },
      mainImage: product13,
    },
    {
      id: 14,
      sku: 'SKU-14',
      name: "The Lip Volumizer",
      category: 'Skin Care',
      price: 195,
      unitPrice: 195,
      description: "Lip care for volume and shimmering shine.",
      inStock: true,
      soldOut: false,
      images: { main: product14 },
      mainImage: product14,
    },
    {
      id: 15,
      sku: 'SKU-15',
      name: "The Lip Volumizer",
      category: 'Skin Care',
      price: 360,
      unitPrice: 360,
      description: "Intensive care for soft lips",
      inStock: true,
      soldOut: false,
      images: { main: product15 },
      mainImage: product15,
    },
    {
      id: 16,
      sku: 'SKU-16',
      name: "The Cool Micellar Cleanser",
      category: 'Skin Care',
      price: 240,
      unitPrice: 240,
      description: "Removes waterproof makeup without water",
      inStock: false,
      soldOut: true,
      images: { main: product16 },
      mainImage: product16,
    },
  ],
  Makeup: [
    {
      id: 5,
      sku: 'SKU-5',
      name: "The Lip Balm",
      category: 'Makeup',
      price: 390,
      unitPrice: 390,
      description:
        "Embody nobility and inner confidence with a single application. A primer creates the depth of light, unveiling a clear complexion.",
      inStock: false,
      soldOut: true,
      images: { main: product5 },
      mainImage: product5,
    },
    {
      id: 6,
      sku: 'SKU-6',
      name: "Future Skin Gel Foundation",
      category: 'Makeup',
      price: 150,
      unitPrice: 150,
      description:
        "A lightweight, oil-free gel foundation with 60% water, buildable coverage, and skincare benefits. Made in Japan.",
      inStock: true,
      soldOut: false,
      images: { main: product6 },
      mainImage: product6,
    },
    {
      id: 7,
      sku: 'SKU-7',
      name: "ROUGE À LÈVRES LIPSTICK",
      category: 'Makeup',
      price: 495,
      unitPrice: 495,
      description: "Intense color and subtle shine with a satin finish.",
      inStock: false,
      soldOut: true,
      images: { main: product7 },
      mainImage: product7,
    },
    {
      id: 8,
      sku: 'SKU-8',
      name: "EYE COLOR QUAD",
      category: 'Makeup',
      price: 270,
      unitPrice: 270,
      description:
        "This eyeshadow collection highlights and defines the eye area and provides ultimate color sophistication combined with luxurious care.",
      inStock: true,
      soldOut: false,
      images: { main: product8 },
      mainImage: product8,
    },
    {
      id: 17,
      sku: 'SKU-17',
      name: "THE FOUNDATION",
      category: 'Makeup',
      price: 315,
      unitPrice: 315,
      description: "Dense texture and smoothness for a refined glow.",
      inStock: true,
      soldOut: false,
      images: { main: product17 },
      mainImage: product17,
    },
    {
      id: 18,
      sku: 'SKU-18',
      name: "THE LIQUID FOUNDATION",
      category: 'Makeup',
      price: 165,
      unitPrice: 165,
      description:
        "Envelops skin with a rich textured, smooth veil of radiance to provide a natural-looking finish with high coverage.",
      inStock: false,
      soldOut: true,
      images: { main: product18 },
      mainImage: product18,
    },
    {
      id: 23,
      sku: 'SKU-23',
      name: "POWDER BLUSH DUO",
      category: 'Makeup',
      price: 345,
      unitPrice: 345,
      description:
        "A silky blush duo that defines and highlights cheeks for a long-lasting, radiant finish. Use shades alone or together for looks from natural to bold.",
      inStock: true,
      soldOut: false,
      images: { main: product23 },
      mainImage: product23,
    },
    {
      id: 24,
      sku: 'SKU-24',
      name: "CREAM BLUSH",
      category: 'Makeup',
      price: 120,
      unitPrice: 120,
      description:
        "A luxurious cream blush with argan oil for a hydrating, luminous touch. Apply with fingers or a brush.",
      inStock: false,
      soldOut: true,
      images: { main: product24 },
      mainImage: product24,
    },
  ],

  "New Arrivals": [
    {
      id: 9,
      sku: 'SKU-9',
      name: "HIGH COVERAGE FOUNDATION BRUSH",
      category: 'New Arrivals',
      price: 135,
      unitPrice: 135,
      description:
        "The professional brush allows you to apply makeup almost effortlessly, giving you an even and perfect finish.",
      inStock: true,
      soldOut: false,
      images: { main: product9 },
      mainImage: product9,
    },
    {
      id: 10,
      sku: 'SKU-10',
      name: "EYE COLOR DUO",
      category: 'New Arrivals',
      price: 420,
      unitPrice: 420,
      description:
        "A silky powder eyeshadow with argan oil for a radiant finish. Available in satin matte or shimmering shades, it fits seamlessly into the Eye Color Quad Case.",
      inStock: false,
      soldOut: true,
      images: { main: product10 },
      mainImage: product10,
    },
    {
      id: 11,
      sku: 'SKU-11',
      name: "RADIANT LIQUID ROUGE SHINE",
      category: 'New Arrivals',
      price: 300,
      unitPrice: 300,
      description:
        "Glossy, non-sticky color for expressive lips. Hydrates, smooths, and delivers a precise, long-lasting finish.",
      inStock: true,
      soldOut: false,
      images: { main: product11 },
      mainImage: product11,
    },
    {
      id: 12,
      sku: 'SKU-12',
      name: "RADIANT CUSHION FOUNDATION NATURAL",
      category: 'New Arrivals',
      price: 450,
      unitPrice: 450,
      description:
        "A cushion foundation with diamond-inspired mesh for a radiant, natural glow. Enhances skin's look while providing lasting hydration.",
      inStock: true,
      soldOut: false,
      images: { main: product12 },
      mainImage: product12,
    },
    {
      id: 19,
      sku: 'SKU-19',
      name: "Repair Serum NAC",
      category: 'New Arrivals',
      price: 435,
      unitPrice: 435,
      description:
        "Meet The Clock-Stopping Serum That Future-Proofs Your Skin To Combat Early Signs Of Ageing.",
      inStock: true,
      soldOut: false,
      images: { main: product19 },
      mainImage: product19,
    },
    {
      id: 20,
      sku: 'SKU-20',
      name: "Wrinkle Erasing Retinol Patches",
      category: 'New Arrivals',
      price: 255,
      unitPrice: 255,
      description: "An Overnight Needle-Free Fix For Fine Lines And Wrinkles.",
      inStock: false,
      soldOut: true,
      images: { main: product20 },
      mainImage: product20,
    },
    {
      id: 21,
      sku: 'SKU-21',
      name: "Black Diamond Eye Cream",
      category: 'New Arrivals',
      price: 375,
      unitPrice: 375,
      description:
        "A Firming Eye Cream For Revitalised, Brighter And Younger-Looking Skin.",
      inStock: false,
      soldOut: true,
      images: { main: product21 },
      mainImage: product21,
    },
    {
      id: 22,
      sku: 'SKU-22',
      name: "Cryo Revitalising Moisturiser",
      category: 'New Arrivals',
      price: 180,
      unitPrice: 180,
      description: "An Energising Moisturiser To Supercharge Your Skin Health.",
      inStock: true,
      soldOut: false,
      images: { main: product22 },
      mainImage: product22,
    },
  ],
};

export const orders: Order[] = [];
