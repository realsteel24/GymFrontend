import { Label } from "@radix-ui/react-label";
import { ChangeEvent, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns"; // Assuming you're using date-fns for date formatting
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false); // To control the popover state
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date()); // Manage month and year changes

  const handleDateChange = (date: Date | undefined) => {
    if (pickDate) {
      pickDate(date); // Trigger date change
    }
    setCurrentMonth(date || new Date()); // Keep the current month in sync with selected date
    setOpen(false); // Close the popover after date is picked
  };

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  " pl-3 text-left bg-white dark:bg-black text-md rounded-md shadow-border col-span-3",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP") // Format the selected date
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange} // Call the date handler
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                captionLayout="dropdown-buttons"
                // Ensure the calendar opens with the correct month/year
                month={currentMonth}
                onMonthChange={setCurrentMonth} // Handle month change
                fromYear={1950}
                toYear={2050}

                // Enable year dropdown for selection
              />
            </PopoverContent>
          </Popover>
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
