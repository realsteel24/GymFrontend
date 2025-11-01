import { StockInventoryOptions } from "@/hooks";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";

export const StockInventoryColumns: ColumnDef<StockInventoryOptions>[] = [
  { accessorKey: "Member.User.name", header: "Name" },
  { accessorKey: "SubItem.Item.name", header: "Item" },
  { accessorKey: "SubItem.name", header: "Sub Item" },
  { accessorKey: "quantity", header: "Qty" },
  { accessorKey: "unitPrice", header: "Unit Price" },
  { accessorKey: "totalAmount", header: "Total" },
  {
    accessorKey: "Method",
    header: "Payment Method",
    cell: ({ row }: { row: { original: StockInventoryOptions } }) => {
      const payment = row.original.PaymentMethod;
      const method = payment
        ? `${payment.mode ?? "N/A"} - ${payment.collectedBy ?? "N/A"}`
        : "N/A";
      return method;
    },
  },
  {
    accessorKey: "date",
    header: "Payment Date",
    cell: ({ row }: { row: { original: StockInventoryOptions } }) => {
      const paidDate = row.original.date ?? "N/A";
      return dateFormat(paidDate, "dd/mm/yyyy");
    },
  },
];
