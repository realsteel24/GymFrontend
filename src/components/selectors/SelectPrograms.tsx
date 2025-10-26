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

interface SelectProgramProps {
  gymId: string;
  programId: string;
  setProgramId: (programId: string) => void;
  bulk?: boolean;
  nextFieldRef?: React.RefObject<HTMLButtonElement>;
}

const SelectPrograms: React.FC<SelectProgramProps> = React.memo(
  ({ gymId, setProgramId, bulk, nextFieldRef }) => {
    const { programLoading, programs, fetchPrograms } = usePrograms({ gymId });
    const [open, setOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] =
      useState<ProgramsOptions | null>(null);
    console.log("renderP");

    useEffect(() => {
      fetchPrograms();
    }, [gymId]);

    const handleProgramSelect = (prog: ProgramsOptions) => {
      setSelectedStatus(prog);
      setProgramId(prog.id);
      setOpen(false);
      setTimeout(() => {
        nextFieldRef?.current?.focus();
      }, 200);
    };

    return (
      <div className="grid grid-cols-4 items-center gap-4 py-4">
        <Label id="program" className="text-right text-md">
          Program
        </Label>

        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              aria-labelledby="program"
              ref={nextFieldRef}
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
              {selectedStatus ? (
                <>
                  {selectedStatus.name} <CaretSortIcon opacity={"50%"} />
                </>
              ) : (
                <>
                  Select Program
                  <CaretSortIcon opacity={"50%"} />
                </>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className={`col-span-3 min-w-60 sm:min-w-72 p-0 z-50 ${
              bulk ? "min-w-56" : ""
            }`}
            align="center"
            side="bottom"
          >
            <Command
              loop
              shouldFilter={false}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
            >
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
                      {programs.map((prog, index) => (
                        <CommandItem
                          key={prog.id}
                          value={prog.id}
                          onSelect={() => handleProgramSelect(prog)}
                          className={`text-md hover:cursor-pointer   ${
                            bulk ? "aria-selected:bg-red-600" : ""
                          }`}
                          tabIndex={index === 0 ? 0 : -1} // Ensure first item gets focus
                        >
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
  }
);

export default SelectPrograms;
