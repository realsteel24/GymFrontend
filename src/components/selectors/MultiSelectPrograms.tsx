import React, { useEffect, useState } from "react";

import { ProgramsOptions, usePrograms } from "@/hooks";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Check } from "lucide-react";

interface SelectProgramProps {
  gymId: string;
  setProgram: (program: string[]) => void;
  bulk?: boolean;
  fn?: any;
}

const MultiSelectPrograms: React.FC<SelectProgramProps> = ({
  gymId,
  setProgram,
  bulk,
}) => {
  const { programLoading, programs, fetchPrograms } = usePrograms({ gymId });
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<ProgramsOptions[]>([]);

  const handleProgramSelect = (prog: ProgramsOptions) => {
    if (selectedStatus.some((item) => item.id === prog.id)) {
      // Remove the program if it already exists in the selected status
      const updatedStatus = selectedStatus.filter(
        (item) => item.id !== prog.id
      );
      setSelectedStatus(updatedStatus);
      setProgram(updatedStatus.map((item) => item.name));
    } else {
      // Add the new program
      const updatedStatus = [...selectedStatus, prog];
      setSelectedStatus(updatedStatus);
      setProgram(updatedStatus.map((item) => item.name));
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [gymId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="program" className="text-right text-md">
        Program
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`col-span-3 justify-between p-3 font-normal text-md ${
              bulk ? "dark:hover:shadow-red-600" : null
            }`}
          >
            {selectedStatus.length < 1 ? (
              <>
                Select Program
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : selectedStatus.length < 2 ? (
              <>
                {selectedStatus.map((name) => name.name)}
                <CaretSortIcon opacity={"50%"} />
              </>
            ) : (
              <>
                Multiple Selected
                <CaretSortIcon opacity={"50%"} />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`col-span-3 min-w-60 sm:min-w-72 p-0 z-50 ${
            bulk ? "min-w-56" : null
          }`}
          align="center"
        >
          <Command>
            <CommandList>
              {programLoading ? (
                <div className="p-2">Loading...</div>
              ) : programs.length === 0 ? (
                <div className="text-md opacity-80 p-1">
                  No options available
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {programs.map((prog) => (
                      <CommandItem
                        key={prog.id}
                        value={`${prog.id}`}
                        onSelect={() => handleProgramSelect(prog)}
                        className={`text-md ${
                          bulk
                            ? "aria-selected:bg-red-600 focus:bg-red-600"
                            : null
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 mr-2 ${
                            selectedStatus.some((item) => item.id === prog.id)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {prog.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiSelectPrograms;
