import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput } from "../LabelledInput";
import { useToast } from "../ui/use-toast";
import SelectMember from "../selectors/SelectMembers";
import SelectPrograms from "../selectors/SelectPrograms";
import SelectBatches from "../selectors/SelectBatches";

export const CreateMemberProgram = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const [programId, setProgramId] = useState("");
  const [memberId, setMemberId] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [batchId, setBatchId] = useState("");

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const clear = () => {
    setProgramId("");
    setBatchId("");
    setMemberId("");
    setError("");
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  async function handleSubmit() {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/memberPrograms`,
        {
          method: "POST",
          body: JSON.stringify({
            startDate,
            programId,
            batchId,
            memberId,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create member program");
      }

      console.log("Member successfully added to program");
      toast({
        title: "Member successfully added to program",
        description: "Success",
      });
      clear();
      navigate(`/gym/${gymId}/menu`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div>
      <CustomDialogForm
        isMobileOpen={isDrawerOpen}
        setIsMobileOpen={setIsDrawerOpen}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        FormTitle="Add Member to Program"
        FormDescription="Please add all the necessary fields and click save"
        titleButton="Add Member"
        drawerTitle="Add Member to Program"
        drawerDescription="Please add all the necessary fields and click save"
        children={
          <div>
            <SelectMember
              gymId={gymId!}
              id="members"
              setMemberId={setMemberId}
            />

            <SelectPrograms
              gymId={gymId!}
              programId={programId}
              setProgramId={setProgramId}
            />

            <SelectBatches
              gymId={gymId!}
              programId={programId}
              batchId={batchId}
              setBatchId={setBatchId}
            />

            <LabelledInput
              formId="Start"
              formName="Start"
              label="Start Date"
              placeholder={"Enter Date"}
              selectedDate={startDate}
              pickDate={(date) => setStartDate(date!)}
              type="Calendar"
            />
            {/* <LabelledInput
              formId="End"
              formName="End"
              label="End Date"
              placeholder={"Enter Date"}
              selectedDate={endDate}
              pickDate={(date) => setEndDate(date)}
              type="Calendar"
            /> */}
          </div>
        }
        button={
          <Button
            type="submit"
            onClick={() => {
              setIsDialogOpen(!isDialogOpen);
              handleSubmit();
            }}
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
