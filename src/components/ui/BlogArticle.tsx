import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { blogArticles } from "@/content/blogArticles";
import { ROUTES } from "@/constants/routes";

function BlogArticle(): JSX.Element {
  const { articleId } = useParams();
  const article = blogArticles.find((entry) => entry.id === articleId);

  if (!article) {
    return <Navigate replace to={ROUTES.BLOG} />;
  }

  return (
    <section className="mx-auto mt-4 w-[min(100%-1.25rem,58rem)] px-0 pb-12 sm:mt-6 sm:w-[min(100%-2rem,58rem)] sm:px-4 sm:pb-16 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 px-1 text-sm font-medium text-[#8c1d40] transition-colors duration-200 hover:text-[#5c0120] sm:px-0"
        to={ROUTES.BLOG}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to blog
      </Link>

      <article className="mt-5 overflow-hidden rounded-[1.1rem] bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
        <div className="aspect-[4/3] overflow-hidden bg-[#fff7f8] sm:aspect-[16/10]">
          <img
            alt={article.title}
            className="h-full w-full object-cover"
            src={article.image}
          />
        </div>

        <div className="p-4 sm:p-7 md:p-9">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#8c1d40] sm:text-[0.72rem] sm:tracking-[0.22em]">
            <span>{article.category}</span>
            <span aria-hidden="true">•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="mt-4 break-words font-['Playfair_Display',serif] text-[1.7rem] leading-[0.95] text-[#5c0120] min-[420px]:text-[2rem] sm:text-[3rem]">
            {article.title}
          </h1>

          <p className="mt-5 text-[0.98rem] leading-7 text-[#5b463d] sm:text-base sm:leading-8">
            {article.excerpt}
          </p>

          <div className="mt-7 space-y-4 text-[0.94rem] leading-7 text-[#4a2a2d] sm:mt-8 sm:space-y-5 sm:text-[0.98rem] sm:leading-8">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

export default BlogArticle;
