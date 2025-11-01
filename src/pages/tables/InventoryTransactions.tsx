import { DataTable } from "@/components/Data-table";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { useInventoryTransactions } from "@/hooks";
import { StockInventoryColumns } from "./columns/StockInventoryColumns";
import { Skeleton } from "@/components/Skeleton";

export const InventoryTransactionsPage = () => {
  const { gymId, memberId } = useParams<{ gymId: string; memberId: string }>();
  const navigate = useNavigate();

  const { inventoryTransaction, inventoryTransactionsLoading } =
    useInventoryTransactions({ gymId: gymId!, memberId: memberId ?? "all" });

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
        Inventory Transactions{" "}
      </div>

      {inventoryTransactionsLoading ? (
        <div className="md:mx-8">
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <div className="relative overflow-x-auto md:mx-8 border rounded-xl">
          <DataTable
            columns={StockInventoryColumns}
            data={inventoryTransaction || []}
          />
        </div>
      )}
    </div>
  );
};

export const ViewInventoryTransactions = (
  gymId: string,
  navigate: NavigateFunction,
  memberId: string = "all"
) => {
  navigate(`/gym/${gymId}/inventorytransactions/${memberId}`);
};
