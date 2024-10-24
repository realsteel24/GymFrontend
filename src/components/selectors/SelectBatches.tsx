import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { BatchOptions, useBatches } from "@/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface SelectBatchProps {
  gymId: string;
  programId: string;
  batchId: string;
  setBatchId: (batchId: string) => void;
  bulk?: boolean;
}

const SelectBatches: React.FC<SelectBatchProps> = ({
  gymId,
  programId,
  batchId,
  setBatchId,
  bulk,
}) => {
  const { batches, loading } = useBatches({ gymId, id: programId });

  useEffect(() => {
    if (programId) {
      batches;
    }
  }, [programId, loading]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="batch" className="text-right text-md">
        Batch
      </Label>

      <Select onValueChange={(value) => setBatchId(value)}>
        <SelectTrigger
          className={`col-span-3 text-md ${
            bulk ? "hover:shadow-red-600" : null
          }`}
          id={batchId}
        >
          <SelectValue placeholder="Choose Batch" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) =>
            // temporary workaround from https://github.com/shadcn-ui/ui/issues/1220
            ref?.addEventListener("touchend", (e) => e.preventDefault())
          }
        >
          {loading ? (
            <div>Loading...</div>
          ) : batches.length === 0 ? (
            <div className="text-md opacity-80 p-1">No options available</div>
          ) : (
            batches.map((batch: BatchOptions) => (
              <SelectItem
                key={batch.id}
                value={batch.id}
                className={`text-md ${
                  bulk ? "hover:shadow-red-600 focus:bg-red-600" : null
                }`}
              >
                {batch.days}: {batch.startTime}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBatches;
