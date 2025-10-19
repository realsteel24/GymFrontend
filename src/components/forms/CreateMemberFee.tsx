import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput, addMonths } from "../LabelledInput";
import { useToast } from "../ui/use-toast";
import SelectMember from "../selectors/SelectMembers";
import SelectPackage from "../selectors/SelectPackage";
import SelectPaymentMethod from "../selectors/SelectPaymentMethod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@/hooks/formstatehook";

interface createFeeRecordProps {
  derivedMemberid?: string;
  type?: string;
  onSuccess?: () => void; // Add callback prop
}

export const CreateMemberFee = ({
  derivedMemberid,
  type,
  onSuccess: onSuccessCallback, // Rename to avoid conflict
}: createFeeRecordProps) => {
  const { gymId } = useParams<{ gymId: string }>();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { formData, setFieldValue, resetForm } = useForm({
    gymId,
    memberId: "",
    feeCategoryId: "",
    paymentMethodId: "",
    paidDate: new Date(),
    dueDate: addMonths(new Date(), 1),
    remarks: "Success",
    feeType: "",
    amount: selectedAmount,
  });

  useEffect(() => {
    if (derivedMemberid) {
      setFieldValue("memberId", derivedMemberid);
    }
  }, [derivedMemberid]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState("");

  const { toast } = useToast();

  const clear = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    resetForm();
    setError("");
  };

  const createFeeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/memberFees`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to create fee record");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment recorded successfully",
        description: `Amount: ${formData.amount}`,
      });

      // Call parent callback to allow parent to refetch or update state
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      clear();
    },
    onError: () => {
      toast({
        title: "Failed to record payment",
        description: "Payment failed",
      });
      setError("An unexpected error occurred");
    },
  });

  const handleSubmit = () => {
    if (createFeeMutation.isPending) return;
    createFeeMutation.mutate();
  };

  return (
    <div>
      {createFeeMutation.isPending && (
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
            {!derivedMemberid && (
              <SelectMember
                gymId={gymId!}
                id="members"
                setMemberId={(id) => setFieldValue("memberId", id)}
                type="member"
              />
            )}
            <SelectPackage
              gymId={gymId!}
              feeCategoryId={formData.feeCategoryId}
              setFeeCategoryId={(id) => setFieldValue("feeCategoryId", id)}
              setSelectedAmount={(amt) => {
                setSelectedAmount(amt);
                setFieldValue("amount", amt);
              }}
              setFeeType={(type) => setFieldValue("feeType", type)}
              setDueDate={(date) => setFieldValue("dueDate", date)}
              setPaidDate={(date) => setFieldValue("paidDate", date)}
              dataToDisplay={formData.dueDate}
              className={formData.feeCategoryId ? "block" : "hidden"}
            />

            <LabelledInput
              formId="Amount"
              formName="Amount"
              label="Amount"
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFieldValue("amount", value);
              }}
              placeholder="Amount"
              disabled={formData.feeType != "Admission Fee"}
            />

            <SelectPaymentMethod
              gymId={gymId!}
              id="paymentMethodId"
              setPaymentMethodId={(id) => setFieldValue("paymentMethodId", id)}
            />

            <LabelledInput
              formId="remark"
              formName="remark"
              label="Remarks"
              value={formData.remarks}
              placeholder="Enter Pending amount if any"
              onChange={(e) => setFieldValue("remarks", e.target.value)}
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