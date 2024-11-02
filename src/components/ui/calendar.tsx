"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { DayPicker, DropdownProps } from "react-day-picker";
import { CaretSortIcon } from "@radix-ui/react-icons";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  bulk?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  bulk,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white dark:bg-black", className)}
      classNames={{
        nav_button: "hidden",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium px-4 flex",
        caption_dropdowns: "flex justify-center gap-1 w-24",

        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-red-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-red-400 text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-red-600 aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, children }: DropdownProps) => {
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
          const selected = options.find((child) => child.props.value === value);

          return (
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-2 max-w-24 min-w-22 focus:ring-0 text-sm border rounded-lg flex justify-center flex-col">
                  {
                    <div className="flex justify-between">
                      {selected?.props?.children}
                      <CaretSortIcon className="w-3 h-3 mt-1 ml-1" />
                    </div>
                  }
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 min-w-10 max-w-24">
                <Command>
                  <CommandList className="max-w-full">
                    {options.map((option, id: number) => (
                      <CommandItem
                        className={`p-2 text-sm w-40 ${
                          bulk ? "aria-selected:bg-red-600" : null
                        }`}
                        key={`${option.props.value}-${id}`}
                        onSelect={() => {
                          const changeEvent = {
                            target: { value: option.props.value },
                          } as React.ChangeEvent<HTMLSelectElement>;
                          onChange?.(changeEvent);
                        }}
                      >
                        {option.props.children}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
