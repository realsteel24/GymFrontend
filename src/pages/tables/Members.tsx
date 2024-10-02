import { DataTable } from "@/components/Data-table";
import { Skeleton } from "@/components/Skeleton";
import { useMembers } from "@/hooks";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { MemberColumns } from "./columns/MemberColumns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

export const Members = () => {
  const { gymId, id } = useParams<{ gymId: string; id: string }>();
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { members, loading, dataCount } = useMembers({
    gymId: gymId!,
    id: id ?? "all",
    page: currentPage,
    rowsPerPage: rowsPerPage,
  });

  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const formattedMembers = members.map((item) => {
    const memberDetail = item.Members[0];
    const memberProgram = memberDetail?.MemberPrograms[0];
    const programName = item.Members[0].MemberPrograms.length > 0
    ? item.Members[0].MemberPrograms.map((program) => program.Program.name || "N/A").join(", ")
    : "N/A";

    const batchName = memberProgram?.Batch?.name || "N/A";
    const enrollmentDate = memberDetail?.enrollmentDate || null;
    const dob = item.dob || null;
    return {
      ...item,
      programName,
      batchName,
      enrollmentDate,
      dob,
    };
  });

  console.log(Math.round(formattedMembers.length));
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
      <div className="flex justify-center text-xl my-6 underline underline-offset-8 decoration-4 decoration-accent">
        Member Details
      </div>
      <div className="flex justify-end m-4">search</div>

      {loading ? (
        <div className="md:mx-8">
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <div className="relative overflow-x-auto border rounded-xl md:mx-8">
          <DataTable columns={MemberColumns} data={formattedMembers} />
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
  );
};

export const ViewMembers = (
  id: string,
  gymId: string,
  navigate: NavigateFunction
) => {
  navigate(`/gym/${gymId}/members/${id}`);
};
