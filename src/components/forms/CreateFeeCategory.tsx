import { Button } from "@/components/ui/button";

import { BACKEND_URL } from "@/config";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput } from "../LabelledInput";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

enum PaymentFrequency {
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  HalfYearly = "HalfYearly",
  Yearly = "Yearly",
  OneTime = "OneTime",
}

export const CreateFeeCategory = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(1500);
  const [frequency, setFrequency] = useState<PaymentFrequency>(
    PaymentFrequency.Monthly
  );
  const { toast } = useToast();
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const handleFrequencyChange = (value: PaymentFrequency) => {
    setFrequency(value);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getEnumValues = <T extends object>(enumObj: T): string[] => {
    return Object.values(enumObj).filter(
      (value) => typeof value === "string"
    ) as string[];
  };

  const frequencyOptions = getEnumValues(PaymentFrequency);

  const clear = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    setDescription("");
    setAmount(0);
    setError("");
    setIsDialogOpen(false);
  };

  async function handleSubmit() {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    try {
      const submit = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/feeCategory`,
        {
          method: "POST",
          body: JSON.stringify({
            description,
            amount,
            frequency,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );
      if (!submit.ok) {
        throw new Error("Failed to create batch");
      }

      console.log("Fee category created successfully");
      toast({
        title: "Package successfully created",
        description: "Success",
      });
      clear();
      navigate(`/gym/${gymId}/menu`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else setError("An unexpected error occurred");
    }
  }
  return (
    <div>
      <CustomDialogForm
        isOpen={isDialogOpen}
        isMobileOpen={isDrawerOpen}
        setIsOpen={setIsDialogOpen}
        setIsMobileOpen={setIsDrawerOpen}
        FormTitle="Create Fee Plan"
        FormDescription=" Please add all the necessary fields and click save"
        drawerTitle="Create Fee Plan"
        drawerDescription=" Please add all the necessary fields and click save"
        titleButton="Create Fee Plan"
        children={
          <div>
            <LabelledInput
              formId="Package"
              formName="Package"
              label="Package Name"
              placeholder="Name"
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-4 items-center gap-4 ">
              <Label htmlFor="frequency" className="text-right text-md">
                Duration
              </Label>
              <Select onValueChange={handleFrequencyChange}>
                <SelectTrigger className="col-span-3 text-md" id={frequency}>
                  <SelectValue placeholder="Choose Package" />
                </SelectTrigger>
                <SelectContent className="bg-opacity-30 border boder-input">
                  {frequencyOptions.map((fee) => (
                    <SelectItem key={fee} value={fee} className="text-md">
                      {fee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <LabelledInput
              formId="Amount"
              formName="Amount"
              label="Amount"
              placeholder="Amount"
              defaultValue="1500"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </div>
        }
        button={
          <Button
            type="submit"
            onClick={handleSubmit}
            variant={"outline"}
            className="bg-accent text-white dark:text-black"
          >
            Save changes
          </Button>
        }
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
