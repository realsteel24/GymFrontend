import { Label } from "@radix-ui/react-label";
import { ChangeEvent, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";
import { CustomDatePicker } from "./CustomDatePicker";

export interface LabelledInputTypes {
  placeholder?: string;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  labelColor?: string;
  textColor?: string;
  formId?: string;
  formName?: string;
  autoComplete?: string;
  type?: string;
  selectedDate?: Date;
  pickDate?: (date: Date | undefined) => void; // Accepts undefined or Date
  value?: number | string;
  required?: boolean;
  bulk?: boolean;
  min?: number;
  disabled?: boolean;
}

export function LabelledInput({
  onBlur,
  placeholder,
  label,
  onChange,
  defaultValue,
  labelColor,
  textColor,
  formName,
  formId,
  type,
  value,
  min,
  autoComplete,
  required,
  selectedDate,
  pickDate,
  bulk,
  disabled,
}: LabelledInputTypes) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date()); // Manage month and year changes
  const handleDateChange = (date: Date | undefined) => {
    if (pickDate) {
      pickDate(date); // Trigger date change
    }
    setCurrentMonth(date || new Date()); // Keep the current month in sync with selected date
  };
  console.log(currentMonth);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor={formName}
          className={`text-right font-medium text-md text-${labelColor}`}
        >
          {label}
        </Label>
        {type === "Calendar" ? (
          bulk ? (
            <CustomDatePicker
              bulk
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          ) : (
            <CustomDatePicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          )
        ) : (
          /* 
            <DatePicker
              id={formId}
              showYearDropdown
              scrollableYearDropdown
              popperPlacement="top-start"
              selected={selectedDate}
              onChange={pickDate!}
              dateFormat={"dd/MM/yyyy"}
              className=" dark:bg-black p-2 text-md rounded-md shadow-   border col-span-3"
              required={required}
            /> */
          <Input
            type={type}
            id={formId}
            defaultValue={defaultValue}
            className={`col-span-3 text-${textColor} text-md`}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            onBlur={onBlur}
            min={min}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}

export const addMonths = (date: Date, months: number) => {
  const custom = new Date(date);
  custom.setMonth(custom.getMonth() + months);
  return custom;
};
