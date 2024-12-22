import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { EnquiryInput } from "realsteelgym";
import dateFormat from "dateformat";

export const EnquiryColumns = (
  navigate: NavigateFunction,
  gymId: string
): ColumnDef<EnquiryInput>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "enquiryDate",
    header: "Date",
    cell: ({ row }: { row: { original: EnquiryInput } }) => {
      const leadDate = row.original.enquiryDate ?? "N/A";
      return dateFormat(leadDate, "dd/mm/yyyy");
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "programs",
    header: "Program",
  },
  {
    accessorKey: "batchPref",
    header: "Preference",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant={"outline"}
        onClick={() => console.log(gymId, row, navigate)}
        size={"sm"}
      >
        View Batches
      </Button>
    ),
  },
];
