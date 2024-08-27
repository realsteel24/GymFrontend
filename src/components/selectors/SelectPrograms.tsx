import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgramsOptions, usePrograms } from "@/hooks";
import { Label } from "../ui/label";

interface SelectProgramProps {
  gymId: string;
  programId: string;
  setProgramId: (programId: string) => void;
}

const SelectPrograms: React.FC<SelectProgramProps> = ({
  gymId,
  programId,
  setProgramId,
}) => {
  const { programLoading, programs, fetchPrograms } = usePrograms({ gymId });

  useEffect(() => {
    fetchPrograms();
  }, [gymId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="program" className="text-right text-md">
        Program
      </Label>
      <Select onValueChange={(value) => setProgramId(value)}>
        <SelectTrigger className="col-span-3 text-md" id={programId}>
          <SelectValue placeholder="Choose Program" />
        </SelectTrigger>
        <SelectContent>
          {programLoading ? (
            <div>Loading...</div>
          ) : programs.length === 0 ? (
            <div className="text-md opacity-80 p-1">No options available</div>
          ) : (
            programs.map((prog: ProgramsOptions) => (
              <SelectItem key={prog.id} value={prog.id} className="text-md">
                {prog.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPrograms;
