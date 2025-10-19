import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  bulk?: boolean;
}

export function CustomDatePicker({
  selectedDate,
  onDateChange,
  bulk,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(
    selectedDate ?? new Date(2025, 0, 1)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={bulk ? "bulkOutline" : "outline"}
          className={cn(
            "w-max justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Select date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[420px] p-0 overflow-hidden"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            if (date) {
              onDateChange(date);
              setTimeout(() => setOpen(false), 100);
            }
          }}
          captionLayout="dropdown"
          startMonth={new Date(1950, 0)}
          endMonth={new Date(month.getFullYear(), 12)}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
