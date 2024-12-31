import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { BatchOptions, useBatches } from "@/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

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
  setBatchId,
  bulk,
}) => {
  const { batches, loading } = useBatches({ gymId, id: programId });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<BatchOptions | null>(
    null
  );
  const handleBatchSelect = (batch: BatchOptions) => {
    setSelectedStatus(batch);
    setBatchId(batch.id);
    setOpen(false);
  };
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`col-span-3 justify-between p-3 font-normal text-md ${
              bulk ? "dark:hover:shadow-red-600" : null
            }`}
          >
            {selectedStatus ? (
              <>
                {selectedStatus.days}: {selectedStatus.startTime}
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Select Batch
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`col-span-3 min-w-60 sm:min-w-72 p-0 z-50 ${
            bulk ? "min-w-56" : null
          }`}
          align="center"
        >
          <Command>
            <CommandList>
              {loading ? (
                <div className="p-2">Loading...</div>
              ) : batches.length === 0 ? (
                <div className="text-md opacity-80 p-2">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {batches.map((batch) => (
                      <CommandItem
                        key={batch.id}
                        value={`${batch.id}`}
                        onSelect={() => handleBatchSelect(batch)}
                        className={`text-md hover:cursor-pointer ${
                          bulk
                            ? "aria-selected:bg-red-600 focus:bg-red-600"
                            : null
                        }`}
                      >
                        {batch.days}: {batch.startTime}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectBatches;
