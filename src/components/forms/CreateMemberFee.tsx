import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput, addMonths } from "../LabelledInput";
import { useToast } from "../ui/use-toast";
import SelectMember from "../selectors/SelectMembers";
import SelectPackage from "../selectors/SelectPackage";
import SelectPaymentMethod from "../selectors/SelectPaymentMethod";

interface createFeeRecordProps {
  derivedMemberid?: string;
  type?: string;
}

export const CreateMemberFee = ({
  derivedMemberid,
  type,
}: createFeeRecordProps) => {
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [feeType, setFeeType] = useState("");
  const [feeCategoryId, setFeeCategoryId] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paidDate, setPaidDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(addMonths(new Date(), 1));
  const [remarks, setRemarks] = useState("Success");
  const [memberId, setMemberId] = useState(
    derivedMemberid ? derivedMemberid : ""
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [compLoading, setCompLoading] = useState(false);

  const { toast } = useToast();

  const clear = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    setFeeCategoryId("");
    setMemberId("");
    setRemarks("");
    setPaymentMethodId("");
    setSelectedAmount(0);
    setIsDialogOpen(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (compLoading) return;

    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    setCompLoading(true);
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
            paymentMethod: paymentMethodId,
            paymentMethodId,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );

      if (!response.ok) {
        setCompLoading(false);
        toast({
          title: `Failed to record payment`,
          description: `Insufficient details`,
        });
        throw new Error("Failed to create fee record");
      }

      toast({
        title: `Payment of recorded successfully`,
        description: `Amount: ${selectedAmount}`,
      });
      clear();
      navigate(`/gym/${gymId}/menu`);
      setCompLoading(false);
    } catch (e) {
      setCompLoading(false);
      toast({
        title: `Failed to record payment`,
        description: `Payment failed`,
      });
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  };
  return (
    <div>
      {compLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}
      <CustomDialogForm
        type={type}
        isOpen={isDialogOpen}
        isMobileOpen={isDrawerOpen}
        setIsOpen={setIsDialogOpen}
        setIsMobileOpen={setIsDrawerOpen}
        FormTitle="Record a Payment"
        FormDescription="Please add all the necessary fields and click save"
        drawerTitle="Record a Payment"
        drawerDescription="Please add all the necessary fields and click save"
        titleButton="Add Transaction"
        mobileFn={clear}
        children={
          <div>
            {derivedMemberid ? null : (
              <SelectMember
                gymId={gymId!}
                id="members"
                setMemberId={setMemberId}
                type="member"
              />
            )}
            <SelectPackage
              gymId={gymId!}
              feeCategoryId={feeCategoryId}
              setFeeCategoryId={setFeeCategoryId}
              setSelectedAmount={setSelectedAmount}
              setFeeType={setFeeType}
              setDueDate={setDueDate}
              setPaidDate={setPaidDate}
              dataToDisplay={dueDate}
              className={feeCategoryId ? "block" : "hidden"}
            />

            <LabelledInput
              formId="Amount"
              formName="Amount"
              label="Amount"
              type="text"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
              placeholder="Amount"
              disabled={feeType != "Admission Fee"}
            />

            <SelectPaymentMethod
              gymId={gymId!}
              id="paymentMethodId"
              setPaymentMethodId={setPaymentMethodId}
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
