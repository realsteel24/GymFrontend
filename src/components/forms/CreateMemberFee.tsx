import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput, addMonths } from "../LabelledInput";
import { useToast } from "../ui/use-toast";
import SelectMember from "../selectors/SelectMembers";
import SelectPackage from "../selectors/SelectPackage";

export const CreateMemberFee = () => {
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const [feeCategoryId, setFeeCategoryId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidDate, setPaidDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(addMonths(new Date(), 1));
  const [remarks, setRemarks] = useState("Success");
  const [memberId, setMemberId] = useState("");

  const { toast } = useToast();

  const clear = () => {
    setFeeCategoryId("");
    setMemberId("");
    setRemarks("");
    setPaymentMethod("");
    setSelectedAmount(0);
    setIsDialogOpen(false);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/memberFees`,
        {
          method: "POST",
          body: JSON.stringify({
            memberId,
            feeCategoryId,
            paidDate,
            dueDate,
            remarks,
            amount: selectedAmount,
            paymentMethod,
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
        title: `Payment of recorded successfully`,
        description: `Amount: ${selectedAmount}`,
      });
      clear();
      navigate(`/gym/${gymId}/menu`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  };
  console.log(`paid: ${paidDate} due: ${dueDate}`);
  return (
    <div>
      <CustomDialogForm
        isOpen={isDialogOpen}
        setIsOpen={() => {
          setIsDialogOpen(!isDialogOpen);

          if (isDialogOpen) {
            clear();
          }
        }}
        FormTitle="Record a Payment"
        FormDescription="Please add all the necessary fields and click save"
        drawerTitle="Record a Payment"
        drawerDescription="Please add all the necessary fields and click save"
        titleButton="Add transaction"
        children={
          <div>
            <SelectMember
              gymId={gymId!}
              id="members"
              setMemberId={setMemberId}
            />
            <SelectPackage
              gymId={gymId!}
              feeCategoryId={feeCategoryId}
              setFeeCategoryId={setFeeCategoryId}
              setSelectedAmount={setSelectedAmount}
              setDueDate={setDueDate}
              setPaidDate={setPaidDate}
              dataToDisplay={dueDate}
            />
            
            <LabelledInput
              formId="Amount"
              formName="Amount"
              label="Amount"
              type="text"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
              placeholder="Amount"
            />

            {/* <LabelledInput
              formId="date"
              formName="date"
              label="Payment Date"
              placeholder="Enter Date"
              selectedDate={paidDate}
              pickDate={(date) => {
                setPaidDate(date);
                const selectedCategory = feeCategoryId;
                if (selectedCategory) {
                  setDueDate(
                    calculateDueDate(date, selectedCategory.frequency)
                  );
                }
              }}
              type="Calendar"
            /> */}

            <LabelledInput
              formId="method"
              formName="method"
              label="Payment Method"
              placeholder="Payment Mode"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <LabelledInput
              formId="remark"
              formName="remark"
              label="Remarks"
              placeholder="Enter Pending amount if any"
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        }
        button={
          <Button type="submit" onClick={handleSubmit} variant={"outline"}>
            Save changes
          </Button>
        }
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

