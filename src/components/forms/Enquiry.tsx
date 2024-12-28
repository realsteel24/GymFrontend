import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "@/components/CustomDialogForm";
import { LabelledInput } from "@/components/LabelledInput";
import { useToast } from "@/components/ui/use-toast";
import { enquiry, EnquiryInput } from "realsteelgym";

import { z } from "zod";
import SelectBatchPref from "../selectors/SelectBatchPref";
import SelectGender from "../selectors/SelectGender";

export const Enquiry = () => {
  const [enquiryInputs, setEnquiryInputs] = useState<EnquiryInput>({
    name: "",
    contact: "",
    age: 0,
    gender: "",
    enquiryDate: new Date(),
    programs: "",
    batchPref: "",
    remarks: "",
    location: "",
    source: "",
  });

  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clear = () => {
    setEnquiryInputs({
      name: "",
      contact: "",
      age: 0,
      gender: "",
      enquiryDate: new Date(),
      location: "",
      programs: "",
      batchPref: "",
      remarks: "",
      source: "",
    });
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  async function handleSubmit() {
    try {
      enquiry.parse(enquiryInputs);
      console.log("Submitting data:", enquiryInputs);

      const submit = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/enquiries`,
        {
          method: "POST",
          body: JSON.stringify({
            ...enquiryInputs,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
        }
      );
      if (!submit.ok) {
        throw new Error("Failed to create Member");
      }

      console.log("Enquiry created successfully");
      toast({
        title: "Enquiry successfully created",
        description: "Success",
      });
      setIsDialogOpen(false);
      setIsDrawerOpen(false);
      clear();
      navigate(`/gym/${gymId}/menu`);
    } catch (e) {
      console.log(e);
      setGeneralError("Create User Failed");
      toast({
        title: `${generalError}`,
        description: `Try again with valid inputs`,
      });
      clear();
    }
  }
  const validateField = (field: keyof typeof enquiryInputs, value: any) => {
    try {
      // Create a partial object with the specific field set to `true`
      const partialSchema: Partial<Record<keyof typeof enquiryInputs, true>> = {
        [field]: true,
      };

      // Validate the specific field
      enquiry.pick(partialSchema).parse({ [field]: value });

      setError((prevErrors) => ({
        ...prevErrors,
        [field]: "", // Clear the error if validation passes
      }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError((prevErrors) => ({
          ...prevErrors,
          [field]: e.errors[0].message, // Set the error message
        }));
      }
    }
  };
  return (
    <div>
      <CustomDialogForm
        isOpen={isDialogOpen}
        isMobileOpen={isDrawerOpen}
        setIsOpen={setIsDialogOpen}
        setIsMobileOpen={setIsDrawerOpen}
        FormTitle="Create new Enquiry"
        FormDescription=" Please add all the necessary fields and click save"
        drawerTitle="Create new Enquiry"
        drawerDescription=" Please add all the necessary fields and click save"
        titleButton="Create Enquiry"
        children={
          <div>
            <LabelledInput
              formId="Name"
              formName="Name"
              autoComplete="name"
              label="Name"
              placeholder="Full Name"
              onBlur={() => validateField("name", enquiryInputs.name)}
              value={enquiryInputs.name}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  name: e.target.value,
                });
              }}
              required
            />
            {error.name && <p className="text-red-500">{error.name}</p>}

            <LabelledInput
              formId="Contact"
              formName="Contact"
              autoComplete="phone"
              label="Contact"
              placeholder="Contact Number"
              value={enquiryInputs.contact}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  contact: e.target.value,
                });
              }}
            />
            {error.contact && <p className="text-red-500">{error.contact}</p>}

            <SelectGender
              gender={enquiryInputs.gender}
              setGender={(value: string) =>
                setEnquiryInputs({
                  ...enquiryInputs,
                  gender: value,
                })
              }
            />

            <SelectBatchPref
              pref={enquiryInputs.batchPref}
              setPref={(value: string) =>
                setEnquiryInputs({
                  ...enquiryInputs,
                  batchPref: value,
                })
              }
            />

            <LabelledInput
              formId="age"
              formName="age"
              autoComplete="age"
              label="Age"
              placeholder="Enter age"
              min={0}
              defaultValue="0"
              value={enquiryInputs.age || ""}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  age: parseInt(e.target.value),
                });
              }}
            />
            {error.age && <p className="text-red-500">{error.age}</p>}

            <LabelledInput
              formId="Location"
              formName="Location"
              autoComplete="Location"
              label="Location"
              placeholder="Landmark"
              value={enquiryInputs.location}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  location: e.target.value,
                });
              }}
            />
            {error.location && <p className="text-red-500">{error.location}</p>}

            <LabelledInput
              formId="program"
              formName="program"
              label="Program"
              placeholder="Kickboxing"
              value={enquiryInputs.programs}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  programs: e.target.value,
                });
              }}
            />

            <LabelledInput
              formId="Enquiry Date"
              formName="Enquiry Date"
              label="Date"
              placeholder="Date of joining"
              selectedDate={enquiryInputs.enquiryDate}
              value={enquiryInputs.enquiryDate.toString()}
              pickDate={(date) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  enquiryDate: date!,
                });
              }}
              type="Calendar"
              required
            />

            <LabelledInput
              formId="source"
              formName="source"
              autoComplete="source"
              label="Source"
              placeholder="How did you know about us?"
              value={enquiryInputs.source}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  source: e.target.value,
                });
              }}
            />

            <LabelledInput
              formId="remarks"
              formName="remarks"
              autoComplete="remarks"
              label="Remark"
              placeholder="Comments"
              value={enquiryInputs.remarks}
              onChange={(e) => {
                setEnquiryInputs({
                  ...enquiryInputs,
                  remarks: e.target.value,
                });
              }}
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
    </div>
  );
};
