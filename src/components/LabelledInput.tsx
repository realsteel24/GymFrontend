import { Label } from "@radix-ui/react-label";
import { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";

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
  pickDate?: (date: Date) => void;
  value?: number | string;
  required?: boolean;
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
  autoComplete,
  required,
  selectedDate,
  pickDate,
}: LabelledInputTypes) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor={formName}
          className={`text-right font-medium text-md text-${labelColor}`}
        >
          {label}
        </Label>
        {type === "Calendar" ? (
          <DatePicker
            id={formId}
            showYearDropdown
            scrollableYearDropdown
            popperPlacement="top-start"
            selected={selectedDate}
            onChange={pickDate!}
            dateFormat={"dd/MM/yyyy"}
            className=" dark:bg-black p-2 text-md rounded-md shadow-sm border col-span-3"
            required={required}
          />
        ) : (
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
