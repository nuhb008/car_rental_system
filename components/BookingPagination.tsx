
import Link from "next/link";

type BookingPaginationProps = {
  currentPage: number;
  totalPages: number;
  search: string;
  status: string;
  sort: string;
};

export default function BookingPagination({
  currentPage,
  totalPages,
  search,
  status,
  sort,
}: BookingPaginationProps) {
  function getPageUrl(page: number) {
    const params = new URLSearchParams();

    if (search) params.set("q", search);
    if (status && status !== "All") {
      params.set("status", status);
    }
    if (sort && sort !== "default") {
      params.set("sort", sort);
    }

    params.set("page", String(page));

    return `/bookings?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Booking pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-4"
    >
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border px-3 py-2 text-sm text-gray-400">
            Previous
          </span>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <Link
              key={page}
              href={getPageUrl(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`rounded-lg border px-3 py-2 text-sm ${
                page === currentPage
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border px-3 py-2 text-sm text-gray-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}