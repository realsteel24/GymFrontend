import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput } from "../LabelledInput";
import { useToast } from "../ui/use-toast";

export const CreatePaymentMethod = () => {
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { toast } = useToast();

  const clear = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    setMode("");
    setCollectedBy("");
    setIsDialogOpen(false);
    setError("");
  };

  const handleSubmit = async () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/createPaymentMethod`,
        {
          method: "POST",
          body: JSON.stringify({
            collectedBy,
            mode,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create fee record");
      }

      toast({
        title: `New Payment Mode added`,
      });
      clear();
      navigate(`/gym/${gymId}/dashboard`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  };
  return (
    <div>
      <CustomDialogForm
        isOpen={isDialogOpen}
        isMobileOpen={isDrawerOpen}
        setIsOpen={setIsDialogOpen}
        setIsMobileOpen={setIsDrawerOpen}
        FormTitle="Create new Payment Mode"
        FormDescription="Please add all the necessary fields and click save"
        drawerTitle="Create New Payment Mode"
        drawerDescription="Please add all the necessary fields and click save"
        titleButton="Add Payment Mode"
        mobileFn={clear}
        children={
          <div>
            <LabelledInput
              formId="Collector"
              formName="Collector"
              label="Collected by"
              type="text"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              placeholder="Person"
            />

            <LabelledInput
              formId="mode"
              formName="mode"
              label="Payment Method"
              placeholder="Payment Mode"
              onChange={(e) => setMode(e.target.value)}
            />
          </div>
        }
        button={
          <Button
            type="submit"
            onClick={handleSubmit}
            variant={"outline"}
            className="bg-accent text-white dark:text-black my-2"
          >
            Save changes
          </Button>
        }
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
