import React, { useEffect, useState } from "react";

import { PaymentMethodOptions, usePaymentMethod } from "@/hooks";
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

interface SelectPaymentMethodProps {
  gymId: string;
  id: string;
  setPaymentMethodId: (paymentMethodId: string) => void;
  bulk?: boolean;
}

const SelectPaymentMethod: React.FC<SelectPaymentMethodProps> = ({
  gymId,
  bulk,
  setPaymentMethodId,
}) => {
  const { mode, methodLoading, fetchMethods } = usePaymentMethod({
    gymId,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] =
    useState<PaymentMethodOptions | null>(null);
  const handleMethodSelect = (item: PaymentMethodOptions) => {
    setSelectedStatus(item);
    setPaymentMethodId(item.id);
    setOpen(false);
  };

  useEffect(() => {
    fetchMethods();
  }, [gymId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="program" className="text-right text-md">
        Payment Mode
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
                {`${selectedStatus.mode} - ${selectedStatus.collectedBy}`}{" "}
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Select Mode
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
              {methodLoading ? (
                <div className="p-2">Loading...</div>
              ) : mode.length === 0 ? (
                <div className="text-md opacity-80 p-1">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {mode.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.id}`}
                        onSelect={() => handleMethodSelect(item)}
                        className={`text-md ${
                          bulk
                            ? "aria-selected:bg-red-600 focus:bg-red-600"
                            : null
                        }`}
                      >
                        {`${item.mode} - ${item.collectedBy}`}
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

export default SelectPaymentMethod;
