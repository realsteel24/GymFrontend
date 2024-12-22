import { DataTable } from "@/components/Data-table";
import { Skeleton } from "@/components/Skeleton";
import { useEnquiry } from "@/hooks";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { EnquiryColumns } from "./columns/EnquiryColumns";

export const Enquiries = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const { enquiry, enquiryLoading, fetchEnquiries } = useEnquiry({
    gymId: gymId!,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchEnquiries();
  }, [gymId]);
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
        Leads & Marketing
      </div>

      {enquiryLoading ? (
        <div className="md:mx-8">
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <div className="relative overflow-x-auto md:mx-8 border rounded-xl">
          <DataTable
            columns={EnquiryColumns(navigate, gymId!)}
            data={enquiry}
          />
        </div>
      )}
    </div>
  );
};

export const ViewEnquiries = (gymId: string, navigate: NavigateFunction) => {
  console.log(gymId);
  navigate(`/gym/${gymId}/enquiries`);
};
