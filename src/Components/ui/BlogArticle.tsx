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
    <section className="mx-auto mt-6 w-[min(100%-2rem,58rem)] px-4 pb-16 sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 text-sm font-medium text-[#8c1d40] transition-colors duration-200 hover:text-[#5c0120]"
        to={ROUTES.BLOG}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to blog
      </Link>

      <article className="mt-5 overflow-hidden rounded-[1.1rem] bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)]">
        <div className="aspect-[16/10] overflow-hidden bg-[#fff7f8]">
          <img
            alt={article.title}
            className="h-full w-full object-cover"
            src={article.image}
          />
        </div>

        <div className="p-5 sm:p-7 md:p-9">
          <div className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-[#8c1d40]">
            <span>{article.category}</span>
            <span aria-hidden="true">•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="mt-4 font-['Playfair_Display',serif] text-[2rem] leading-[0.96] text-[#5c0120] sm:text-[3rem]">
            {article.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-[#5b463d]">
            {article.excerpt}
          </p>

          <div className="mt-8 space-y-5 text-[0.98rem] leading-8 text-[#4a2a2d]">
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
