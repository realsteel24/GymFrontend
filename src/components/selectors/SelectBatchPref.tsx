import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SelectBatchPref = ({
  pref,
  setPref,
}: {
  pref: string;
  setPref: (value: string) => void;
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 py-2">
      <Label htmlFor="gender" className="text-right text-md">
        Batch Preference
      </Label>
      <Select onValueChange={setPref} value={pref}>
        <SelectTrigger className={`col-span-3 text-md `}>
          <SelectValue placeholder="Select preference" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) =>
            ref?.addEventListener("touchend", (e) => e.preventDefault())
          }
        >
          <SelectItem value="Morning" className={`text-md `}>
            Morning
          </SelectItem>
          <SelectItem value="Evening" className={`text-md `}>
            Evening
          </SelectItem>
          <SelectItem value="Other" className={`text-md `}>
            Other
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBatchPref;