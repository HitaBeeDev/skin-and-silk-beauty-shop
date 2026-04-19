import img1 from "@/assets/new/p7.jpg";
import img2 from "@/assets/new/p8.jpg";
import img3 from "@/assets/new/p9.jpg";
import img4 from "@/assets/new/p10.jpg";
import img5 from "@/assets/new/p5.jpg";

export type BlogArticle = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  paragraphs: string[];
  featured?: boolean;
};

export const blogArticles: BlogArticle[] = [
  {
    id: "luxury-beauty-ritual",
    title: "How to build a luxury beauty ritual that still feels effortless",
    category: "Editorial",
    excerpt:
      "A strong routine does not need twelve steps. The best rituals layer texture, timing, and purpose so skin and makeup feel considered without becoming complicated.",
    image: img1,
    readTime: "3 min read",
    featured: true,
    paragraphs: [
      "Luxury in beauty is usually less about quantity and more about sequence. When products arrive in the right order, the routine feels slower, calmer, and much more intentional even if it only takes a few minutes.",
      "A good ritual usually starts with one anchor product. That might be a serum with a distinct texture, a moisturizer with comforting slip, or a complexion product that immediately changes how polished the skin looks. Once that anchor is clear, every supporting product should feel like it belongs beside it.",
      "The real test is whether the routine feels easy to repeat. If it is too long, too technical, or too crowded, it stops feeling luxurious and starts becoming maintenance. The best premium routines are the ones you can actually keep.",
      "That is why edited shelves often feel more expensive than full ones. Fewer products force better choices, and better choices create the sense of refinement that people usually describe as luxury.",
    ],
  },
  {
    id: "glow-radiance-shine",
    title: "The difference between glow, radiance, and shine",
    category: "Skin Notes",
    excerpt:
      "Understanding finish helps you choose formulas that look expensive on the skin instead of simply reflective.",
    image: img2,
    readTime: "1 min read",
    paragraphs: [
      "Glow usually suggests softness. It looks like light moving across hydrated skin without obvious sparkle or oiliness. Radiance is slightly more controlled and often comes from a formula that smooths the surface so light reflects more evenly.",
      "Shine is different. Shine is stronger, more direct, and easier to notice on high points or oil-prone areas. It is not automatically bad, but it creates a very different effect from a refined radiant finish.",
      "When people say a complexion looks expensive, they often mean it has radiance instead of raw shine. The difference is subtle, but it changes the entire read of the makeup.",
    ],
  },
  {
    id: "premium-textures-through-the-day",
    title: "Why premium textures change how makeup wears through the day",
    category: "Makeup",
    excerpt:
      "Texture decides whether a base melts into skin gracefully or starts looking separate by midday.",
    image: img3,
    readTime: "2 min read",
    paragraphs: [
      "Most people notice color first, but texture is what determines longevity. A refined texture spreads more evenly, settles more cleanly, and adapts better to the movement of the face during the day.",
      "That matters because wear is rarely ruined all at once. It usually breaks down in small ways first: a base catches on dry areas, powder gathers around movement, or the skin starts to look coated instead of lived-in.",
      "Premium formulas often feel lighter because they are balanced better, not because they do less. That balance is what keeps makeup looking present rather than heavy several hours later.",
    ],
  },
  {
    id: "small-product-wardrobes",
    title: "Small product wardrobes beat crowded bathroom shelves",
    category: "Routine Design",
    excerpt:
      "A tighter edit creates better habits, cleaner pairings, and a calmer visual experience every morning.",
    image: img4,
    readTime: "3 min read",
    paragraphs: [
      "A product wardrobe works the same way a clothing wardrobe does. It should contain enough variation to give you options, but not so much that every decision becomes slower and less certain.",
      "Crowded shelves create friction. The more you have, the less clearly you remember what works together, which product deserves repurchase, and which items actually support your routine.",
      "A smaller edit usually improves consistency. You reach for the right things faster, the products pair more cleanly, and the space itself feels calmer.",
      "That calm is not just aesthetic. It changes behavior. When the visual environment is cleaner, the ritual feels easier to maintain and much more deliberate.",
    ],
  },
  {
    id: "personal-beauty-gifting",
    title: "What makes a beauty gift feel personal instead of generic",
    category: "Gifting",
    excerpt:
      "Presentation matters, but the real signal is choosing products that match mood, lifestyle, and ritual.",
    image: img5,
    readTime: "2 min read",
    paragraphs: [
      "A strong beauty gift says something specific. It suggests you noticed how someone likes to live, get ready, travel, or unwind. That is what separates a personal gift from a random premium item.",
      "Packaging helps, but product category matters more. A soft hand treatment for someone who travels often feels more attentive than a dramatic product chosen only because it looks expensive.",
      "The most memorable gifts fit naturally into an existing ritual. They feel like an upgrade to a habit the person already enjoys, which is why they are more likely to be used and remembered.",
    ],
  },
];

export const featuredBlogArticle =
  blogArticles.find((article) => article.featured) ?? blogArticles[0];
