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
  bulk,
}: {
  gender: string;
  setGender: (value: string) => void;
  bulk?: boolean;
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="gender" className="text-right text-md">
        Gender*
      </Label>
      <Select onValueChange={setGender} value={gender}>
        <SelectTrigger
          className={`col-span-3 text-md ${
            bulk ? "hover:shadow-red-600" : null
          }`}
        >
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) =>
            ref?.addEventListener("touchend", (e) => e.preventDefault())
          }
        >
          <SelectItem
            value="Male"
            className={`text-md ${
              bulk ? "hover:shadow-red-600 focus:bg-red-600" : null
            }`}
          >
            Male
          </SelectItem>
          <SelectItem
            value="Female"
            className={`text-md ${
              bulk ? "hover:shadow-red-600 focus:bg-red-600" : null
            }`}
          >
            Female
          </SelectItem>
          <SelectItem
            value="Other"
            className={`text-md ${
              bulk ? "hover:shadow-red-600 focus:bg-red-600" : null
            }`}
          >
            Other
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGender;
