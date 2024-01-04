"use client";
// @ts-ignore
import usePagination from "@lucasmogari/react-pagination";

import PaginationLink from "@/components/PaginationLink";

interface PaginationProps {
  page: number;
  totalItems: number;
  perPage: number;
}

const Pagination = ({ page, totalItems, perPage }: PaginationProps) => {
  const { getPageItem, totalPages } = usePagination({
    totalItems,
    page,
    itemsPerPage: perPage,
    maxPageItems: 3,
  });

  const firstPage = 1;

  const nextPage = Math.min(page + 1, getPageItem);
  const prevPage = Math.max(page - 1, firstPage);

  const arr = new Array(totalPages + 2);

  return (
    <div className={"flex items-center justify-center gap-2 mt-4"}>
      {[...arr].map((_, i) => {
        const { page, disabled, current } = getPageItem(i);

        if (page === "previous") {
          return (
            <PaginationLink disabled={disabled} page={prevPage} key={i}>
              {"<"}
            </PaginationLink>
          );
        }

        if (page === "next") {
          return (
            <PaginationLink disabled={disabled} page={nextPage} key={i}>
              {">"}
            </PaginationLink>
          );
        }

        if (page === "gap") {
          return <span key={i}>...</span>;
        }

        return (
          <PaginationLink active={current} page={page} key={i}>
            {page}
          </PaginationLink>
        );
      })}
    </div>
  );
};

//
// type PaginationLinkProps = {
//   page?: number | string;
//   active?: boolean;
//   disabled?: boolean;
// } & PropsWithChildren;
//
// function PaginationLink({ page, children, ...props }: PaginationLinkProps) {
//   const params = useSearchParams();
//   const limit = PRODUCTS_PER_PAGE;
//   const skip = page ? (Number(page) - 1) * limit : 0;
//
//   let currentQuery = {};
//
//   if (params) {
//     currentQuery = qs.parse(params.toString());
//   }
//
//   // we use existing data from router query, we just modify the page.
//   const updatedQuery: any = {
//     ...currentQuery,
//     page,
//     skip,
//   };
//
//   return (
//     <Link
//       // only use the query for the url, it will only modify the query, won't modify the route.
//       href={{ query: updatedQuery }}
//       // toggle the appropriate classes based on active, disabled states.
//       className={cn({
//         "p-2": true,
//         "font-bold text-orange-500": props.active,
//         "text-gray-500": !props.active,
//         "pointer-events-none text-gray-200": props.disabled,
//       })}
//     >
//       {children}
//     </Link>
//   );
// }
// export default memo(Pagination);

export default Pagination;
