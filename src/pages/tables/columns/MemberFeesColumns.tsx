import { Button } from "@/components/ui/button";
import { MemberFeeOptions } from "@/hooks";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";
import { NavigateFunction } from "react-router-dom";
import { ViewMemberFees } from "../MemberFees";

const checkAndUpdateStatus = (dueDate: string, status: string) => {
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  if (dueDateObj < today) {
    return "Pending";
  }

  return status;
};

export const MemberFeesColumns = (
  navigate: NavigateFunction,
  gymId: string
): ColumnDef<MemberFeeOptions>[] => [
  {
    accessorKey: "Member",
    header: "Name",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const user = row.original.Member.User.name ?? "N/A";
      return user;
    },
  },
  {
    accessorKey: "FeeCategory",
    header: "Package",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const pack = row.original.FeeCategory.description ?? "N/A";
      return pack;
    },
  },
  {
    accessorKey: "Payments",
    header: "Amount Paid",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const amount = row.original.Payments?.[0]?.amount ?? "N/A";
      return amount;
    },
  },
  {
    accessorKey: "paidDate",
    header: "Payment Date",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const paidDate = row.original.paidDate ?? "N/A";
      return dateFormat(paidDate, "dd/mm/yyyy");
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const dueDate = row.original.dueDate ?? "N/A";
      return dateFormat(dueDate, "dd/mm/yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const dueDate = row.original.dueDate;
      const status = checkAndUpdateStatus(dueDate, row.original.status);
      return (
        <span
          className={`${
            status === "Pending" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Action",

    cell: ({ row }) => (
      <Button
        variant={"outline"}
        onClick={() => ViewMemberFees(gymId, row.original.memberId, navigate)}
        size={"sm"}
      >
        View Payment Details
      </Button>
    ),
  },
];
