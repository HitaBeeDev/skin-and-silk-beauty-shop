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
      className="font-[300] text-[#c80842] text-[0.7rem]"
    >
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 ? " / " : null}
          {item.to ? (
            <Link
              className="font-[300] text-[#a70a3f] text-[0.7rem]"
              to={item.to}
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-[400] text-[#a70a3f] text-[0.7rem]">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
