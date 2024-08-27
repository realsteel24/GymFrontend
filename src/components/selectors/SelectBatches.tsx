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
}

const SelectBatches: React.FC<SelectBatchProps> = ({
  gymId,
  programId,
  batchId,
  setBatchId,
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
        <SelectTrigger className="col-span-3 text-md" id={batchId}>
          <SelectValue placeholder="Choose Batch" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div>Loading...</div>
          ) : batches.length === 0 ? (
            <div className="text-md opacity-80 p-1">No options available</div>
          ) : (
            batches.map((batch: BatchOptions) => (
              <SelectItem key={batch.id} value={batch.id} className="text-md">
                {batch.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBatches;
