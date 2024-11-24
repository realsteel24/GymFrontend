import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  format,
  addMonths,
  setYear,
  startOfMonth,
  isSameMonth,
  isToday,
} from "date-fns";
import { useState } from "react";
import { CalendarIcon } from "lucide-react"; // Optional for the icon
import { Button } from "./ui/button";

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
  const [open, setOpen] = useState(false);
  const [viewingDate, setViewingDate] = useState(selectedDate || new Date());

  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), "MMMM")
  );
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i); // Custom range

  const handleDateClick = (date: Date) => {
    onDateChange(date);
    setOpen(false);
  };

  const handleMonthChange = (month: number) => {
    setViewingDate(
      addMonths(startOfMonth(viewingDate), month - viewingDate.getMonth())
    );
  };

  const handleYearChange = (year: number) => {
    setViewingDate(setYear(viewingDate, year));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={bulk ? "bulkOutline" : "outline"}
          className="border p-2 pl-3 rounded-md col-span-3 font-normal text-md flex justify-between text-left"
        >
          {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 bg-white dark:bg-black rounded-md shadow-lg border border-2 max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <select
            value={viewingDate.getMonth()}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            style={{ width: "120px" }} // Custom width in pixels
            className="p-2 rounded-md bg-white dark:bg-black ml-2 border focus:outline-none"
          >
            {months.map((month, idx) => (
              <option key={month} value={idx}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={viewingDate.getFullYear()}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="p-2 rounded-md bg-white dark:bg-black mr-2 border focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          viewingDate={viewingDate}
          onSelectDate={handleDateClick}
        />
      </PopoverContent>
    </Popover>
  );
}

interface CalendarGridProps {
  viewingDate: Date;
  onSelectDate: (date: Date) => void;
}

function CalendarGrid({ viewingDate, onSelectDate }: CalendarGridProps) {
  const startDay = startOfMonth(viewingDate);
  const daysInMonth = Array.from(
    {
      length: new Date(
        viewingDate.getFullYear(),
        viewingDate.getMonth() + 1,
        0
      ).getDate(),
    },
    (_, i) => new Date(viewingDate.getFullYear(), viewingDate.getMonth(), i + 1)
  );

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-semibold">
          {day}
        </div>
      ))}
      {Array.from({ length: startDay.getDay() }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {daysInMonth.map((day) => (
        <button
          key={day.toDateString()}
          onClick={() => onSelectDate(day)}
          className={`p-2 rounded-lg ${
            isToday(day)
              ? "bg-orange-600"
              : isSameMonth(day, viewingDate)
              ? "bg-white dark:bg-black hover:bg-accent dark:hover:bg-red-800"
              : "bg-white"
          }`}
        >
          {day.getDate()}
        </button>
      ))}
    </div>
  );
}
