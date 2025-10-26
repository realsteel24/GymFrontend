import React, { useEffect, useState } from "react";

import { ItemOptions, useItem } from "@/hooks";
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
  setItemId: (itemId: string) => void;
}

const SelectItems: React.FC<SelectItemProps> = ({ gymId, setItemId }) => {
  const { item, itemLoading, fetchItems } = useItem({
    gymId,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ItemOptions | null>(
    null
  );
  const handleItemSelect = (item: ItemOptions) => {
    setSelectedStatus(item);
    setItemId(item.id);
    setOpen(false);
  };

  useEffect(() => {
    fetchItems();
  }, [gymId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-4">
      <Label id="selectItem" className="text-right text-md">
        Product
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
                Select Product
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
              {itemLoading ? (
                <div className="p-2">Loading...</div>
              ) : item.length === 0 ? (
                <div className="text-md opacity-80 p-1">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {item.map((spec) => (
                      <CommandItem
                        key={spec.id}
                        value={`${spec.id}`}
                        onSelect={() => handleItemSelect(spec)}
                        className={`text-md hover:cursor-pointer`}
                      >
                        {`${spec.name}`}
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

export default SelectItems;
