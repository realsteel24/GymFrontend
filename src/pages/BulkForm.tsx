import { LabelledInput } from "@/components/LabelledInput";

export const BulkForm = () => {
  return (
    <div className="">
      <LabelledInput label="Fullname" />
      <LabelledInput label="Contact" />
      <LabelledInput label="Email" />
      <LabelledInput label="Address" />
      <LabelledInput label="Occupation" />
    </div>
  );
};
