import { Label } from "@radix-ui/react-label";
import { ChangeEvent } from "react";
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
  pickDate?: (date: Date) => void;
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
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor={formId}
          className={`text-right font-medium text-md text-${labelColor}`}
        >
          {label}
        </Label>

        {type === "Calendar" ? (
          <CustomDatePicker
            bulk={bulk}
            selectedDate={selectedDate}
            onDateChange={pickDate ?? (() => {})}
          />
        ) : (
          <Input
            type={type}
            id={formId}
            name={formName}
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
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};
