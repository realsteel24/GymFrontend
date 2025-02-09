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
  const genderList = ["Male", "Female", "Other"];
  return (
    <div className="grid grid-cols-4 items-center gap-4 py-4">
      <Label htmlFor="gender" className="text-right text-md">
        Gender*
      </Label>
      <Select onValueChange={setGender} value={gender}>
        <SelectTrigger
          className={`col-span-3 text-md ${
            bulk ? "hover:shadow-red-600" : null
          }`}
        >
          data-native=
          {typeof window !== "undefined" &&
            /iPhone|iPad|iPod/.test(navigator.userAgent)}
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent
          ref={(ref) =>
            ref?.addEventListener("touchend", (e) => e.preventDefault())
          }
        >
          {genderList.map((item) => (
            <SelectItem
              key={item}
              value={item}
              className={`text-md hover:cursor-pointer ${
                bulk ? "aria-selected:bg-red-600 " : null
              }`}
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGender;
