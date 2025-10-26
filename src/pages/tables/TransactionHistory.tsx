import { DataTable } from "@/components/Data-table";
import { Skeleton } from "@/components/Skeleton";
import { MemberFeeOptions, useTransactionHistory } from "@/hooks";
import {
  NavigateFunction,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { TransactionHistoryColumn } from "./columns/TransactionHistoryColumn";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { CreateMemberFee } from "@/components/forms/CreateMemberFee";
import { CreateInventoryItem } from "@/components/forms/CreateInventoryItem";

export const TransactionHistory = () => {
  const { gymId, memberId } = useParams<{ gymId: string; memberId: string }>();
  useEffect(() => {
    // Trigger refetch whenever URL param changes
    refetch?.();
  }, [memberId]);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "";

  const rowsPerPage = Number(searchParams.get("rowsPerPage")) || 20;
  const [columns] = useState<typeof TransactionHistoryColumn>(() => [
    ...TransactionHistoryColumn,
  ]);

  const {
    transactionHistoryLoading,
    transactionHistory,
    dataCount,
    refetch, // Make sure your hook returns refetch
  } = useTransactionHistory({
    gymId: gymId!,
    memberId: memberId ?? "all",
    page: currentPage,
    rowsPerPage: rowsPerPage,
    type,
  });

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(dataCount / rowsPerPage);

  // Debug: Log when data changes
  useEffect(() => {}, [transactionHistory, transactionHistoryLoading]);

  const handlePageChange = (pageNumber: number) => {
    const queryParams = new URLSearchParams({
      page: String(pageNumber),
      rowsPerPage: String(rowsPerPage),
    });

    if (type) {
      queryParams.set("type", type);
    }

    navigate(
      `/gym/${gymId}/transactionHistory/${memberId}?${queryParams.toString()}`
    );
  };

  return (
    <div>
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white hidden md:block ml-6 hover:text-accent hover:dark:text-accent cursor-pointer"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 8 14"
        onClick={() => navigate(-1)}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
        />
      </svg>
      <div className="flex justify-center text-xl my-6 underline underline-offset-8 decoration-4 decoration-accent font-semibold">
        Transaction History
      </div>

      {memberId === "all" ? null : (
        <div className="text-end mb-4 mx-4 md:mx-8 flex justify-end">
          {/* ✅ CRITICAL: Pass the onSuccess callback */}
          <CreateInventoryItem
            derivedMemberid={memberId}
            type="stock-mini"
            onSuccess={() => {
              refetch?.();
            }}
          />
          <div className="text-end mx-4 md:mx-8">
            <CreateMemberFee
              derivedMemberid={memberId}
              type="mini"
              onSuccess={() => {
                refetch?.();
              }}
            />
          </div>
        </div>
      )}

      <div>
        {transactionHistoryLoading ? (
          <div className="md:mx-8">
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="relative overflow-x-auto border rounded-xl mx-2 md:mx-8">
            <DataTable
              columns={columns}
              data={transactionHistory.map((fee: MemberFeeOptions) => ({
                ...fee,
                navigate,
              }))}
            />
          </div>
        )}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() => {
                  handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>

            {show === true
              ? [...Array(totalPages).keys()].map((page) => (
                  <PaginationItem key={page + 1}>
                    <PaginationLink
                      className={
                        currentPage === page + 1
                          ? "active cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
              : null}
            <PaginationItem>
              <PaginationEllipsis
                className={totalPages > 5 ? "visible" : "hidden"}
                onClick={() => setShow(!show)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={() => {
                  handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export const ViewTransactions = (
  gymId: string,
  memberId: string,
  navigate: NavigateFunction,
  page: number = 1,
  rowsPerPage: number = 20,
  type: string
) => {
  const queryParams = new URLSearchParams({
    page: String(page),
    rowsPerPage: String(rowsPerPage),
    type,
  }).toString();

  navigate(`/gym/${gymId}/transactionHistory/${memberId}?${queryParams}`);
};
