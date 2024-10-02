import { DataTable } from "@/components/Data-table";
import { Skeleton } from "@/components/Skeleton";
import { useTransactionHistory } from "@/hooks";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { TransactionHistoryColumn } from "./columns/TransactionHistoryColumn";
import { useState } from "react";
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

export const TransactionHistory = () => {
  const { gymId, memberId } = useParams<{ gymId: string; memberId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { transactionHistoryLoading, transactionHistory, dataCount } =
    useTransactionHistory({
      gymId: gymId!,
      memberId: memberId ?? "all",
      page: currentPage,
      rowsPerPage: rowsPerPage,
    });
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const columns = TransactionHistoryColumn();
  const totalPages = Math.ceil(dataCount / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
      <div className="text-end mb-4 mx-4 md:mx-8 flex justify-end">
      <CreateMemberFee derivedMemberid={memberId} type="mini"/>
      </div>
        <div>
        {transactionHistoryLoading ? (
          <div className="md:mx-8">
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="relative overflow-x-auto border rounded-xl md:mx-8">
            <DataTable
              columns={columns}
              data={transactionHistory.map((fee) => ({ ...fee, navigate }))}
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
  navigate: NavigateFunction
) => {
  navigate(`/gym/${gymId}/transactionHistory/${memberId}`);
};
