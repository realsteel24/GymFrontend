import { MemberFeeOptions } from "@/hooks";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";

export const TransactionHistoryColumn: ColumnDef<MemberFeeOptions>[] = [
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
    accessorKey: "Method",
    header: "Payment Method",
    cell: ({ row }: { row: { original: MemberFeeOptions } }) => {
      const payment = row.original.Payments?.[0];
      const method = payment
        ? `${payment.PaymentMethod?.mode ?? "N/A"} - ${
            payment.PaymentMethod?.collectedBy ?? "N/A"
          }`
        : "N/A";
      return method;
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
];
