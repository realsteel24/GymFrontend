import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SelectGender = ({
  gender,
  setGender,
}: {
  gender: string;
  setGender: (value: string) => void;
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="gender" className="text-right text-md">
        Gender*
      </Label>
      <Select onValueChange={setGender} value={gender}>
        <SelectTrigger className="col-span-3 text-md">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) =>
            ref?.addEventListener("touchend", (e) => e.preventDefault())
          }
        >
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGender;
