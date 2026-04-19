import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { blogArticles, featuredBlogArticle } from "@/content/blogArticles";
import { ROUTES } from "@/constants/routes";

function Blog(): JSX.Element {
  const articles = blogArticles.filter(
    (article) => article.id !== featuredBlogArticle.id,
  );

  return (
    <section className="mx-auto mt-6 w-[min(100%-2rem,72rem)] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[1.1rem] bg-[#fff0f2] p-5 sm:p-7 md:p-9">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
              Journal
            </p>
            <h1 className="mt-3 font-['Playfair_Display',serif] text-[2rem] leading-[0.96] text-[#5c0120] sm:text-[2.8rem]">
              Beauty stories, product thinking, and quieter luxury notes.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5b463d] sm:text-base">
              The blog extends the storefront mood into editorial form: product
              context, routine advice, and visual inspiration with the same calm
              premium tone as the rest of the brand.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 ml-5">
            <div className="rounded-[1rem] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(85,0,0,0.18)]">
              <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                Focus
              </p>
              <p className="mt-3 font-['Playfair_Display',serif] text-lg text-[#5c0120]">
                Refined routines
              </p>
            </div>

            <div className="rounded-[1rem] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(85,0,0,0.18)]">
              <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                Tone
              </p>
              <p className="mt-3 font-['Playfair_Display',serif] text-lg text-[#5c0120]">
                Editorial calm
              </p>
            </div>

            <div className="rounded-[1rem] bg-white p-4 shadow-[0_18px_42px_-34px_rgba(85,0,0,0.18)]">
              <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
                Format
              </p>
              <p className="mt-3 font-['Playfair_Display',serif] text-lg text-[#5c0120]">
                Short reads
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="overflow-hidden rounded-[1.1rem] bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
          <Link
            className="grid gap-0 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
            to={`${ROUTES.BLOG}/${featuredBlogArticle.id}`}
          >
            <div className="relative min-h-[18rem] overflow-hidden bg-[#fff7f8]">
              <img
                alt={featuredBlogArticle.title}
                className="h-full w-full object-cover"
                src={featuredBlogArticle.image}
              />
            </div>

            <div className="flex flex-col justify-between gap-6 p-5 sm:p-7">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#8c1d40]">
                  <span>{featuredBlogArticle.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{featuredBlogArticle.readTime}</span>
                </div>

                <h2 className="mt-4 font-['Playfair_Display',serif] text-[1.8rem] leading-tight text-[#5c0120] sm:text-[2.2rem]">
                  {featuredBlogArticle.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#5b463d] sm:text-base">
                  {featuredBlogArticle.excerpt}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-3 rounded-full bg-[#8c1d40] px-5 py-3 text-sm font-[400] text-white transition-colors duration-200 hover:bg-[#a70a3f]">
                Read full article
                <ArrowUpRight size={16} strokeWidth={2} />
              </span>
            </div>
          </Link>
        </article>

        <aside className="rounded-[1.1rem] bg-[#550000] p-5 text-[#fff0f0] shadow-[0_18px_45px_rgba(85,0,0,0.14)] sm:p-7">
          <p className="mt-5 text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#ffcad4]">
            Editorial Direction
          </p>

          <h2 className="mt-3 font-['Playfair_Display',serif] text-[1.8rem] leading-tight text-white">
            Fewer stories, better signal.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#ffe3e7]">
            This page is designed as a clean brand journal rather than a noisy
            magazine wall. Each article keeps the same visual restraint as the
            storefront so the transition feels intentional.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1rem] border border-white/10 bg-white/6 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#ffcad4]">
                What belongs here
              </p>
              <p className="mt-2 text-sm leading-6 text-[#fff0f0]">
                Routine guides, ingredient explainers, gifting edits, and makeup
                finish advice.
              </p>
            </div>

            <div className="rounded-[1rem] border border-white/10 bg-white/6 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#ffcad4]">
                What stays out
              </p>
              <p className="mt-2 text-sm leading-6 text-[#fff0f0]">
                Clickbait headlines, crowded metadata, and overly technical
                content that breaks the mood.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
              Latest Reads
            </p>
            <h2 className="mt-2 font-['Playfair_Display',serif] text-[1.8rem] leading-tight text-[#5c0120] sm:text-[2.2rem]">
              Recent editorial notes
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-[#8c1d40] transition-colors duration-200 hover:text-[#5c0120]"
            to={ROUTES.PRODUCTS}
          >
            Shop what inspired the stories
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              className="overflow-hidden rounded-[1.1rem] bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1"
              to={`${ROUTES.BLOG}/${article.id}`}
            >
              <div className="aspect-[5/4] overflow-hidden bg-[#fff7f8]">
                <img
                  alt={article.title}
                  className="h-full w-full object-cover"
                  src={article.image}
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-[#8c1d40]">
                  <span>{article.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="mt-3 font-['Playfair_Display',serif] text-[1.35rem] leading-tight text-[#5c0120]">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#5b463d]">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Blog;
