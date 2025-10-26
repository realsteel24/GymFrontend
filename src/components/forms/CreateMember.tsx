import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "@/components/CustomDialogForm";
import { LabelledInput } from "@/components/LabelledInput";
import { toast } from "@/components/ui/use-toast";
import { createMember, CreateMemberInput } from "realsteelgym";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { z } from "zod";
import SelectGender from "../selectors/SelectGender";

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
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("PersonalDetails");

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
    setActiveTab("PersonalDetails");
  };

  async function handleSubmit() {
    try {
      createMember.parse(createMemberInput);
      console.log("Submitting data:", createMemberInput);

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
        throw new Error("Failed to create Member");
      }

      console.log("Member created successfully");
      toast({
        title: "Member successfully created",
        description: "Success",
      });
      setIsDialogOpen(false);
      setIsDrawerOpen(false);
      clear();
      navigate(`/gym/${gymId}/dashboard`);
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
  const validateField = (field: keyof typeof createMemberInput, value: any) => {
    try {
      // Create a partial object with the specific field set to `true`
      const partialSchema: Partial<
        Record<keyof typeof createMemberInput, true>
      > = {
        [field]: true,
      };

      // Validate the specific field
      createMember.pick(partialSchema).parse({ [field]: value });

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
        FormTitle="Add new Member"
        FormDescription=" Please add all the necessary fields and click save"
        drawerTitle="Add new Member"
        drawerDescription=" Please add all the necessary fields and click save"
        titleButton="Create Member"
        children={
          <div>
            <Tabs
              defaultValue="PersonalDetails"
              className=" text-center"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="PersonalDetails">
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="OtherDetails">Other Details</TabsTrigger>
              </TabsList>
              <TabsContent value="PersonalDetails">
                <LabelledInput
                  formId="Name"
                  formName="Name"
                  autoComplete="name"
                  label="Name"
                  placeholder="Full Name"
                  onBlur={() => validateField("name", createMemberInput.name)}
                  value={createMemberInput.name}
                  onChange={(e) => {
                    setCreateMemberInput({
                      ...createMemberInput,
                      name: e.target.value,
                    });
                  }}
                  required
                />
                {error.name && <p className="text-red-500">{error.name}</p>}
                <LabelledInput
                  formId="Email"
                  formName="Email"
                  autoComplete="email"
                  label="Email"
                  placeholder="@gmail.com"
                  value={createMemberInput.email}
                  onBlur={() => validateField("name", createMemberInput.email)}
                  onChange={(e) => {
                    setCreateMemberInput({
                      ...createMemberInput,
                      email: e.target.value,
                    });
                  }}
                  required
                />
                {error.email && (
                  <p className="text-red-500 text-end">{"Invalid Email"}</p>
                )}{" "}
                <LabelledInput
                  formId="Contact"
                  formName="Contact"
                  autoComplete="phone"
                  label="Contact"
                  placeholder="Contact Number"
                  value={createMemberInput.contact}
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
                  value={createMemberInput.dob.toString()}
                  pickDate={(date) => {
                    setCreateMemberInput({ ...createMemberInput, dob: date! });
                  }}
                  type="Calendar"
                  required
                />
                <SelectGender
                  gender={createMemberInput.gender}
                  setGender={(value: string) =>
                    setCreateMemberInput({
                      ...createMemberInput,
                      gender: value,
                    })
                  }
                />
                <LabelledInput
                  formId="address"
                  formName="address"
                  autoComplete="address"
                  label="Address"
                  placeholder="Residential address"
                  value={createMemberInput.address}
                  onChange={(e) => {
                    setCreateMemberInput({
                      ...createMemberInput,
                      address: e.target.value,
                    });
                  }}
                  required
                />
              </TabsContent>
              <TabsContent value="OtherDetails">
                <LabelledInput
                  formId="goals"
                  formName="goals"
                  autoComplete="goals"
                  label="Goals"
                  placeholder="Your Fitness/ Martial Arts goals?"
                  value={createMemberInput.goals}
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
                  value={createMemberInput.medical}
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
                  value={createMemberInput.instagram}
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
                  value={createMemberInput.referral}
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
                  value={createMemberInput.enrollmentDate.toString()}
                  pickDate={(date) => {
                    setCreateMemberInput({
                      ...createMemberInput,
                      enrollmentDate: date!,
                    });
                  }}
                  type="Calendar"
                  required
                />
              </TabsContent>
            </Tabs>
          </div>
        }
        button={
          activeTab === "OtherDetails" ? (
            <Button
              type="submit"
              onClick={handleSubmit}
              variant={"outline"}
              className="bg-accent text-white dark:text-black"
            >
              Save changes
            </Button>
          ) : null
        }
      />
    </div>
  );
};
