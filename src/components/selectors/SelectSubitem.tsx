import React, { useEffect, useState } from "react";

import { SubitemOptions, useSubitem } from "@/hooks";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";

interface SelectItemProps {
  gymId: string;
  itemId: string;
  setSubitemId: (subitemId: string) => void;
  setAmount: (amount: string) => void;
}

const SelectSubitem: React.FC<SelectItemProps> = ({
  gymId,
  itemId,
  setSubitemId,
  setAmount,
}) => {
  const { subitem, subitemLoading } = useSubitem({
    gymId,
    itemId,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<SubitemOptions | null>(
    null
  );
  const handleSubitemSelect = (item: SubitemOptions) => {
    setSelectedStatus(item);
    setSubitemId(item.id);
    setAmount(item.sellingPrice);
    setOpen(false);
  };

  useEffect(() => {
    if (itemId) {
      subitem;
    }
  }, [subitemLoading, itemId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-4">
      <Label id="selectItem" className="text-right text-md">
        Variant
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-labelledby="selectItem"
            variant="outline"
            className={`col-span-3 justify-between p-3 font-normal text-md`}
          >
            {selectedStatus ? (
              <>
                {`${selectedStatus.name} `}
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Select Variant
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`col-span-3 min-w-60 sm:min-w-72 p-0 z-50`}
          align="center"
        >
          <Command>
            <CommandList>
              {subitemLoading ? (
                <div className="p-2">Loading...</div>
              ) : subitem.length === 0 ? (
                <div className="text-md opacity-80 p-1">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {subitem.map((spec) => (
                      <CommandItem
                        key={spec.id}
                        value={`${spec.id}`}
                        onSelect={() => handleSubitemSelect(spec)}
                        className={`text-md hover:cursor-pointer flex justify-between`}
                      >
                        <div> {`${spec.name}`} </div>
                        <div className="text-xs font-light"> {`stock: ${spec.stock}`} </div>
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

export default SelectSubitem;
