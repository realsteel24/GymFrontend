import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { FeeOptions, useFeeCategories } from "@/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LabelledInput } from "../LabelledInput";

interface SelectFeeCategoryProps {
  gymId: string;
  feeCategoryId: string;
  setFeeCategoryId: (feeCategoryId: string) => void;
  setSelectedAmount: (amount: number) => void;
  setDueDate: (dueDate: Date) => void;
  setPaidDate: (paidDate: Date) => void;
  dataToDisplay: Date;
}

const SelectPackage: React.FC<SelectFeeCategoryProps> = ({
  gymId,
  feeCategoryId,
  setFeeCategoryId,
  setSelectedAmount,
  setDueDate,
  setPaidDate,
  dataToDisplay,
}) => {
  const { feeCategories, fetchCategories, feeCategoryLoading } =
    useFeeCategories({ gymId });

  const [freq, setFreq] = useState<string>("");
  const [selectDate, setSelectDate] = useState<Date>(new Date());

  const handleSelectionChange = (value: string) => {
    setFeeCategoryId(value);
    const selectedCategory = feeCategories.find((item) => item.id === value);
    if (selectedCategory) {
      setSelectedAmount(parseInt(selectedCategory.amount));
      setFreq(selectedCategory.frequency);
    }
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
      <Select onValueChange={handleSelectionChange}>
        <SelectTrigger className="col-span-3 text-md" id={feeCategoryId}>
          <SelectValue placeholder="Choose Package" />
        </SelectTrigger>
        <SelectContent>
          {feeCategoryLoading ? (
            <div>Loading...</div>
          ) : feeCategories.length === 0 ? (
            <div className="text-sm opacity-80 p-1 ">No options available</div>
          ) : (
            feeCategories.map((fee: FeeOptions) => (
              <SelectItem key={fee.id} value={fee.id}>
                {fee.description}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <div className="col-span-4">
        <LabelledInput
          formId="date"
          formName="date"
          label="Payment Date"
          placeholder="Enter Date"
          pickDate={(date) => {
            setPaidDate(date);
            setSelectDate(date);
          }}
          selectedDate={selectDate}
          type="Calendar"
        />
        <LabelledInput
          formId="dueDate"
          formName="dueDate"
          label="Due Date"
          placeholder="Enter Date"
          selectedDate={dataToDisplay}
          type="Calendar"
        />
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
