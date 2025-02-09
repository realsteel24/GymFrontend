import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

interface SelectGenderProps {
  gender: string;
  setGender: (value: string) => void;
  bulk?: boolean;
}

const SelectGender: React.FC<SelectGenderProps> = ({
  gender,
  setGender,
  bulk,
}) => {
  const [open, setOpen] = useState(false);
  const genderList = ["Male", "Female", "Other"];

  const handleSelect = (selectedGender: string) => {
    setGender(selectedGender);
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-4">
      <Label htmlFor="gender" className="text-right text-md">
        Gender*
      </Label>

      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`col-span-3 justify-between p-3 font-normal text-md ${
              bulk ? "dark:hover:shadow-red-600" : ""
            }`}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                setOpen(true);
              }
            }}
          >
            {gender ? (
              <>
                {gender}
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Select Gender
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="col-span-3 min-w-60 sm:min-w-72 p-0 z-50"
          align="center"
          side="bottom"
        >
          <Command
            loop
            shouldFilter={false}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          >
            <CommandList>
              {genderList.length === 0 ? (
                <CommandEmpty>No options available</CommandEmpty>
              ) : (
                <CommandGroup>
                  {genderList.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => handleSelect(item)}
                      className={`text-md hover:cursor-pointer ${
                        bulk ? "aria-selected:bg-red-600" : ""
                      }`}
                    >
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectGender;
