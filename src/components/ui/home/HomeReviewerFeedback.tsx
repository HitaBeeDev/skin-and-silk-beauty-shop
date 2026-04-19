import { Star } from "lucide-react";

import p1 from "@/assets/new/p1.jpg";
import p2 from "@/assets/new/p2.jpg";
import p3 from "@/assets/new/p3.jpg";
import p4 from "@/assets/new/p4.jpg";
import p5 from "@/assets/new/p5.jpg";
import p6 from "@/assets/new/p6.jpg";

type Review = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: "review-1",
    name: "Lina Hart",
    role: "Skincare Editor",
    quote:
      "The texture feels expensive and the finish stays fresh all day without becoming heavy.",
    image: p1,
    rating: 5,
  },
  {
    id: "review-2",
    name: "Maya Chen",
    role: "Beauty Creator",
    quote:
      "Every order has felt carefully curated. The formulas look polished and perform exactly as promised.",
    image: p2,
    rating: 4.5,
  },
  {
    id: "review-3",
    name: "Sara Voss",
    role: "Wellness Buyer",
    quote:
      "It has that boutique feel I wanted from the homepage: refined, calm, and easy to trust.",
    image: p3,
    rating: 4,
  },
  {
    id: "review-4",
    name: "Nadia Bloom",
    role: "Makeup Artist",
    quote:
      "The product selection feels premium and the discounted picks still look elevated, not crowded.",
    image: p4,
    rating: 4.5,
  },
  {
    id: "review-5",
    name: "Elise Rowan",
    role: "Spa Consultant",
    quote:
      "I would absolutely trust this shop for gifting. The presentation already feels luxurious before checkout.",
    image: p5,
    rating: 5,
  },
  {
    id: "review-6",
    name: "Amira Stone",
    role: "Product Tester",
    quote:
      "Clean layout, strong imagery, and enough softness in the palette to keep the brand feeling premium.",
    image: p6,
    rating: 4,
  },
];

function ReviewCard({ review }: { review: Review }): JSX.Element {
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 !== 0;

  return (
    <article
      className="w-[min(16.5rem,calc(100vw-4rem))] shrink-0 rounded-[1.1rem] border border-[#8c1d40]/10 bg-white/90 p-4 
    shadow-[0_18px_45px_rgba(85,0,0,0.08)] backdrop-blur-sm sm:w-[19rem] sm:p-5"
    >
      <div className="flex items-center gap-3">
        <img
          src={review.image}
          alt={review.name}
          className="h-[3.25rem] w-[3.25rem] rounded-full object-cover object-center"
        />

        <div className="min-w-0">
          <p className="truncate text-[0.95rem] font-[500] text-[#2f1618]">
            {review.name}
          </p>

          <p className="text-[0.58rem] font-[300] tracking-[0.04em] text-[#7e5c5f] uppercase sm:text-[0.6rem]">
            {review.role}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[0.85rem] font-[300] leading-[1.7] text-[#4a2a2d] sm:mt-5 sm:text-[0.9rem]">
        {review.quote}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-[0.65rem] font-[300] uppercase text-[#8c1d40]">
          Verified Review
        </p>

        <div className="flex items-center gap-[0.10rem] text-[#ff6988]">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFull = index < fullStars;
            const isHalf = index === fullStars && hasHalfStar;

            return (
              <span
                key={`${review.id}-star-${index}`}
                className="relative inline-flex h-4 w-4"
              >
                <Star className="h-4 w-4 text-[#ff6988]" strokeWidth={1.4} />
                {isFull ? (
                  <Star
                    className="absolute inset-0 h-4 w-4 fill-current"
                    strokeWidth={1.4}
                  />
                ) : null}
                {isHalf ? (
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: "50%" }}
                  >
                    <Star className="h-4 w-4 fill-current" strokeWidth={1.4} />
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function HomeReviewerFeedback(): JSX.Element {
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="mt-10 overflow-hidden rounded-[1.1rem] bg-[linear-gradient(135deg,#fff7f8_0%,#fff0f2_45%,#fde6eb_100%)] px-5 py-8 sm:px-7 md:px-10 md:py-10">
      <style>
        {`
          @keyframes home-review-scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

        `}
      </style>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[34rem]">
          <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
            Reviewer Feedback
          </p>
          <p className="mt-3 font-['Playfair_Display',serif] text-[1.7rem] font-[400] leading-[1.02] text-[#3e0f1f] sm:text-[2rem]">
            Trusted opinions from beauty lovers who notice the details.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden">
        <div
          className="flex w-max gap-3 sm:gap-4"
          style={{
            animation: "home-review-scroll-left 30s linear infinite",
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeReviewerFeedback;
