import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { FeeOptions, useFeeCategories } from "@/hooks";
import { LabelledInput } from "../LabelledInput";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";

interface SelectFeeCategoryProps {
  gymId: string;
  feeCategoryId: string;
  setFeeCategoryId: (feeCategoryId: string) => void;
  setSelectedAmount: (amount: number) => void;
  setDueDate: (dueDate: Date) => void;
  setPaidDate: (paidDate: Date) => void;
  dataToDisplay?: Date;
  className?: string;
}

const SelectPackage: React.FC<SelectFeeCategoryProps> = ({
  gymId,
  setFeeCategoryId,
  setSelectedAmount,
  setDueDate,
  setPaidDate,
  dataToDisplay,
  className,
}) => {
  const { feeCategories, fetchCategories, feeCategoryLoading } =
    useFeeCategories({ gymId });

  const [freq, setFreq] = useState<string>("");
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<FeeOptions | null>(null);
  const handleFeeSelection = (fees: FeeOptions) => {
    setSelectedStatus(fees);
    setFeeCategoryId(fees.id);
    const selectedCategory = feeCategories.find((item) => item.id === fees.id);
    if (selectedCategory) {
      setSelectedAmount(parseInt(selectedCategory.amount));
      setFreq(selectedCategory.frequency);
    }
    setOpen(false);
  };

  useEffect(() => {
    const newDueDate = calculateDueDate(selectDate, freq);
    setDueDate(newDueDate);
  }, [selectDate, freq]);

  const calculateDueDate = (startDate: Date, frequency: string): Date => {
    const frequencies = {
      onetime: 240,
      monthly: 1,
      quarterly: 3,
      halfYearly: 6,
      yearly: 12,
    };
    const monthsToAdd =
      frequencies[frequency.toLowerCase() as keyof typeof frequencies] || 1;
    return addMonths(startDate, monthsToAdd);
  };

  useEffect(() => {
    fetchCategories();
  }, [gymId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="feeCategory" className="text-right text-md">
        Fee Plan
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`col-span-3 justify-between p-3 font-normal text-md }`}
          >
            {selectedStatus ? (
              <>
                {selectedStatus.description} <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Choose Package
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="col-span-3 p-0 z-50" align="center">
          <Command>
            <CommandList>
              {feeCategoryLoading ? (
                <div className="p-2">Loading...</div>
              ) : feeCategories.length === 0 ? (
                <div className="text-md opacity-80 p-2">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {feeCategories.map((fee) => (
                      <CommandItem
                        key={fee.id}
                        value={`${fee.id}`}
                        onSelect={() => handleFeeSelection(fee)}
                        className={`text-md`}
                      >
                        {fee.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className={`col-span-4 ${className}`}>
        <LabelledInput
          formId="date"
          formName="date"
          label="Payment Date"
          placeholder="Enter Date"
          pickDate={(date) => {
            setPaidDate(date!);
            setSelectDate(date!);
            console.log(dataToDisplay);
          }}
          selectedDate={selectDate}
          type="Calendar"
        />
        {/* <LabelledInput
          formId="dueDate"
          formName="dueDate"
          label="Due Date"
          placeholder="Enter Date"
          selectedDate={dataToDisplay}
          type="Calendar"
        /> */}
      </div>
    </div>
  );
};

export default SelectPackage;

function addMonths(startDate: Date, monthsToAdd: number): Date {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
}
