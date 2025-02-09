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
  const preferences = ["Morning", "Evening", "Any", "Others"];
  return (
    <div className="grid grid-cols-4 items-center gap-4 py-4">
      <Label htmlFor="gender" className="text-right text-md">
        Batch Preference
      </Label>
      <Select onValueChange={setPref} value={pref}>
        <SelectTrigger className={`col-span-3 text-md `}>
          <SelectValue placeholder="Select preference" />
        </SelectTrigger>
        <SelectContent>
          {preferences.map((item) => (
            <SelectItem value={item} className={`text-md hover:cursor-pointer`}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBatchPref;
