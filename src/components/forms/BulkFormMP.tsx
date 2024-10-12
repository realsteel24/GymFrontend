import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LabelledInput } from "@/components/LabelledInput";
import { useToast } from "@/components/ui/use-toast";
import { createMember, CreateMemberInput } from "realsteelgym";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

export const CreateMemberBulk = () => {
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
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { toast } = useToast();
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
    setActiveTab("PersonalDetails");
  };

  async function handleSubmit() {
    try {
      createMember.parse(createMemberInput);
      const submit = await fetch(`${BACKEND_URL}/api/v1/admin/${gymId}/users`, {
        method: "POST",
        body: JSON.stringify({ ...createMemberInput }),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token") ?? "",
        },
      });
      if (!submit.ok) {
        throw new Error("Failed to create Member");
      }

      toast({
        title: "Member successfully created",
        description: "Success",
      });
      clear();
      navigate(`/gym/${gymId}/thankyou`);
    } catch (e) {
      console.error(e);
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
      const partialSchema: Partial<
        Record<keyof typeof createMemberInput, true>
      > = {
        [field]: true,
      };
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
    <div className="relative bg-black bg-opacity-80 rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <Tabs
        defaultValue="PersonalDetails"
        className="text-center"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex justify-center mb-4 bg-black">
          <TabsTrigger
            value="PersonalDetails"
            className={`py-2 px-4 ${
              activeTab === "PersonalDetails"
                ? "text-black bg-orange-500"
                : "text-white"
            } border-b-2 border-transparent hover:border-orange-300 focus:outline-none focus:border-orange-500`}
          >
            Personal Details
          </TabsTrigger>
          <TabsTrigger
            value="OtherDetails"
            className={`py-2 px-4 ${
              activeTab === "OtherDetails"
                ? "text-black bg-orange-500"
                : "text-white"
            } border-b-2 border-transparent hover:border-orange-300 focus:outline-none focus:border-orange-500`}
          >
            Other Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="PersonalDetails" className="w-full">
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
          {error.name && <p className="text-red-500 mb-4">{error.name}</p>}
          <LabelledInput
            formId="Email"
            formName="Email"
            autoComplete="email"
            label="Email"
            placeholder="@gmail.com"
            value={createMemberInput.email}
            onBlur={() => validateField("email", createMemberInput.email)}
            onChange={(e) => {
              setCreateMemberInput({
                ...createMemberInput,
                email: e.target.value,
              });
            }}
            required
          />
          {error.email && (
            <p className="text-red-500 mb-4">{"Invalid Email"}</p>
          )}
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
              setCreateMemberInput({ ...createMemberInput, dob: date });
            }}
            type="Calendar"
            required
          />
          <LabelledInput
            formId="Gender"
            formName="Gender"
            autoComplete="gender"
            label="Gender"
            placeholder="eg. Female"
            value={createMemberInput.gender}
            onChange={(e) => {
              setCreateMemberInput({
                ...createMemberInput,
                gender: e.target.value,
              });
            }}
            required
          />
          <LabelledInput
            formId="Address"
            formName="Address"
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
                enrollmentDate: date,
              });
            }}
            type="Calendar"
            required
          />
        </TabsContent>
      </Tabs>
      {generalError && <p className="text-red-500 mb-4">{generalError}</p>}
      {activeTab === "OtherDetails" ? (
        <Button
          onClick={handleSubmit}
          className="bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-500 mt-4 w-full"
        >
          Submit
        </Button>
      ) : (
        <Button
          onClick={() => setActiveTab("OtherDetails")}
          className="bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-500 mt-4 w-full"
        >
          Next
        </Button>
      )}
    </div>
  );
};
