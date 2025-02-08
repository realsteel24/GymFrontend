import { DataTable } from "@/components/Data-table";
import { Skeleton } from "@/components/Skeleton";
import { useMemberFees } from "@/hooks";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { MemberFeesColumns } from "./columns/MemberFeesColumns";

export const MemberFees = () => {
  const { gymId, memberId } = useParams<{ gymId: string; memberId: string }>();

  const { memberFeesLoading, memberFees } = useMemberFees({
    gymId: gymId!,
    memberId: memberId ?? "all",
  });
  const navigate = useNavigate();

  const columns = MemberFeesColumns(navigate, gymId!);

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
        Member Fees
      </div>
      <div>
        {memberFeesLoading ? (
          <div className="mx-2 md:mx-8">
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="relative overflow-x-auto border rounded-xl mx-2 md:mx-8">
            <DataTable
              columns={columns}
              data={memberFees.map((fee) => ({ ...fee, navigate }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const ViewMemberFees = (
  gymId: string,
  memberId: string,
  navigate: NavigateFunction
) => {
  navigate(`/gym/${gymId}/transactionHistory/${memberId}`);
};

export const ViewMemberships = (gymId: string, navigate: NavigateFunction) => {
  navigate(`/gym/${gymId}/memberFees/all`);
};
