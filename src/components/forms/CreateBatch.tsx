import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput } from "../LabelledInput";
import { useToast } from "../ui/use-toast";
import SelectPrograms from "../selectors/SelectPrograms";

export const CreateBatch: React.FC = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("8:00 PM");
  const [endTime, setEndTime] = useState("9:00 PM");
  const [days, setDays] = useState("Mon, Wed, Fri");
  const [programId, setProgramId] = useState("");
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const clear = () => {
    setStartTime("");
    setEndTime("");
    setError("");
    setDays("");
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    setProgramId("")
    setName("")
  };

  async function handleSubmit() {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    try {
      const submit = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/batches`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            startTime,
            endTime,
            days,
            programId,
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

      console.log("Batch created successfully");
      toast({
        title: "Batch successfully created",
        description: "Success",
      });
      clear();
      navigate(`/gym/${gymId}/dashboard`);
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
        FormTitle="Create a Batch"
        FormDescription=" Please add all the necessary fields and click save"
        drawerTitle="Create a Batch"
        drawerDescription=" Please add all the necessary fields and click save"
        titleButton="Create Batch"
        children={
          <div>
            <SelectPrograms
              gymId={gymId!}
              programId={programId}
              setProgramId={setProgramId}
            />
            <LabelledInput
              formId="Batch"
              formName="Batch"
              label="Batch Name"
              placeholder="Batch Name"
              onChange={(e) => setName(e.target.value)}
            />
            <LabelledInput
              formId="Start"
              formName="Start"
              label="Start Time"
              placeholder="Time"
              defaultValue="8:00 PM"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <LabelledInput
              formId="End"
              formName="End"
              label="End Time"
              placeholder="Time"
              defaultValue="9:00 PM"
              onChange={(e) => setEndTime(e.target.value)}
            />
            <LabelledInput
              formId="Days"
              formName="Days"
              label="Days"
              placeholder="Days"
              defaultValue="Mon, Wed, Fri"
              onChange={(e) => setDays(e.target.value)}
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

export default CreateBatch;
