import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "@/components/CustomDialogForm";
import { LabelledInput } from "@/components/LabelledInput";
import { useToast } from "@/components/ui/use-toast";
import { CreateMemberInput } from "realsteelgym";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CreateMember = () => {
  const [createMemberInput, setCreateMemberInput] = useState<CreateMemberInput>(
    {
      name: "",
      email: "",
      contact: "",
      dob: new Date(),
      gender: "",
      enrollmentDate: new Date(),
      address: "",
      goals: "",
      referral: "",
      instagram: "",
      medical: "",
    }
  );

  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clear = () => {
    setCreateMemberInput({
      name: "",
      email: "",
      contact: "",
      dob: new Date(),
      gender: "",
      enrollmentDate: new Date(),
      address: "",
      goals: "",
      referral: "",
      instagram: "",
      medical: "",
    });
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  async function handleSubmit() {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
    try {
      const submit = await fetch(`${BACKEND_URL}/api/v1/admin/${gymId}/users`, {
        method: "POST",
        body: JSON.stringify({
          ...createMemberInput,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") ?? "",
        },
      });
      if (!submit.ok) {
        throw new Error("Failed to create batch");
      }

      console.log("Member created successfully");
      toast({
        title: "Member successfully created",
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
        FormTitle="Add new Member"
        FormDescription=" Please add all the necessary fields and click save"
        drawerTitle="Add new Member"
        drawerDescription=" Please add all the necessary fields and click save"
        titleButton="Create Member"
        children={
          <div>
            <Accordion type="single" defaultValue="personalDetails">
              <AccordionItem value="personalDetails">
                <AccordionTrigger>Personal Details</AccordionTrigger>
                <AccordionContent>
                  <LabelledInput
                    formId="Name"
                    formName="Name"
                    autoComplete="name"
                    label="Name"
                    placeholder="Full Name"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        name: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="Email"
                    formName="Email"
                    autoComplete="email"
                    label="Email"
                    placeholder="@gmail.com"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        email: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="Contact"
                    formName="Contact"
                    autoComplete="phone"
                    label="Contact"
                    placeholder="Contact Number"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        contact: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="Birth Date"
                    formName="Birth Date"
                    label="Birth Date"
                    placeholder={"Enter Date"}
                    selectedDate={createMemberInput.dob}
                    pickDate={(date) => {
                      setCreateMemberInput({ ...createMemberInput, dob: date });
                    }}
                    type="Calendar"
                  />

                  <LabelledInput
                    formId="Gender"
                    formName="Gender"
                    autoComplete="gender"
                    label="Gender"
                    placeholder="eg. Female"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        gender: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="address"
                    formName="address"
                    autoComplete="address"
                    label="Address"
                    placeholder="Residential address"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        address: e.target.value,
                      });
                    }}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="otherInformation">
                <AccordionTrigger>Other details</AccordionTrigger>
                <AccordionContent>
                  <LabelledInput
                    formId="goals"
                    formName="goals"
                    autoComplete="goals"
                    label="Goals"
                    placeholder="What are your Fitness/Martial Arts goals?"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        goals: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="medical"
                    formName="medical"
                    autoComplete="medical"
                    label="Medical History"
                    placeholder="Injuries - Leave blank if none"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        medical: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="ig"
                    formName="ig"
                    autoComplete="instagram"
                    label="Instagram Handle"
                    placeholder="instagram_id"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        instagram: e.target.value,
                      });
                    }}
                  />
                  <LabelledInput
                    formId="referral"
                    formName="referral"
                    autoComplete="referral"
                    label="Referred by"
                    placeholder="How did you hear about us?"
                    onChange={(e) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        referral: e.target.value,
                      });
                    }}
                  />

                  <LabelledInput
                    formId="Enroll"
                    formName="Enroll"
                    label="Date of Admission"
                    placeholder="Date of joining"
                    selectedDate={createMemberInput.enrollmentDate}
                    pickDate={(date) => {
                      setCreateMemberInput({
                        ...createMemberInput,
                        enrollmentDate: date,
                      });
                    }}
                    type="Calendar"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
