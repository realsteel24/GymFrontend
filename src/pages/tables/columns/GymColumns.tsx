import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { GymOptions } from "@/hooks";

export const GymColumns: ColumnDef<GymOptions>[] = [
  {
    accessorKey: "name",
    header: "Gym",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "operationalHours",
    header: "Operational hours",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Button
        variant={"outline"}
        onClick={() => {
          row.original.navigate(`/gym/${row.original.id}/dashboard`);
        }}
        size={"sm"}
      >
        Actions
      </Button>
    ),
  },
];
