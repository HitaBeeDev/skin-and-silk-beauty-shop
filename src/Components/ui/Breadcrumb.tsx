import { Fragment } from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

function Breadcrumb({ items }: BreadcrumbProps): JSX.Element {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-1 gap-y-2 font-[300] text-[0.68rem] text-[#c80842] sm:text-[0.7rem]"
    >
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.to ? (
            <Link
              className="max-w-full break-words font-[300] text-[#a70a3f] text-[0.68rem] sm:text-[0.7rem]"
              to={item.to}
            >
              {item.label}
            </Link>
          ) : (
            <span className="max-w-full break-words font-[400] text-[#a70a3f] text-[0.68rem] sm:text-[0.7rem]">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
