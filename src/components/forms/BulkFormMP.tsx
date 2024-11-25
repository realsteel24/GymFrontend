import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LabelledInput } from "@/components/LabelledInput";
import { useToast } from "@/components/ui/use-toast";
import { createMember, CreateMemberInput } from "realsteelgym";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import SelectPrograms from "../selectors/SelectPrograms";
import SelectBatches from "../selectors/SelectBatches";
import { CardTitle } from "../ui/card";
import SelectGender from "../selectors/SelectGender";
import planet from "@/assets/planetlogo-white.png";

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
  const [loading, setLoading] = useState(false);

  const [programId, setProgramId] = useState("");
  const [batchId, setBatchId] = useState("");
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
    setLoading(true);
    try {
      createMember.parse(createMemberInput);
      const submit = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/users/importForm`,
        {
          method: "POST",
          body: JSON.stringify({ ...createMemberInput, programId, batchId }),

          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
      setGeneralError("Form submission failed");
      toast({
        title: `Form submission failed`,
        description: `Try again with valid inputs`,
      });
    } finally {
      setLoading(false);
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
        [field]: "",
      }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError((prevErrors) => ({
          ...prevErrors,
          [field]: e.errors[0].message,
        }));
      }
    }
  };

  return (
    <div className="relative bg-black bg-opacity-90 md:bg-opacity-90 rounded-lg shadow-lg p-6 max-w-lg mx-3 sm:mx-0">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}{" "}
      {/* Loader display */}
      <svg
        className={`w-4 h-4 text-white ${
          activeTab === "PersonalDetails" ? "hidden" : null
        }    ml-2 hover:text-accent hover:dark:text-red-600 cursor-pointer`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 8 14"
        onClick={
          activeTab === "MembershipDetails"
            ? () => setActiveTab("OtherDetails")
            : activeTab === "OtherDetails"
            ? () => setActiveTab("PersonalDetails")
            : () => null
        }
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
        />
      </svg>
      <CardTitle className="text-center text-2xl text-accent pb-2 md:pb-2 flex justify-center items-center content-center">
        <img
          src={planet}
          alt="Description of the image"
          className="w-24 h-24"
        />
      </CardTitle>
      <Tabs
        defaultValue="PersonalDetails"
        value={activeTab}
        className="text-center"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex justify-center mb-4 bg-black hidden">
          <TabsTrigger
            value="PersonalDetails"
            className={`py-2 px-4 ${
              activeTab === "PersonalDetails"
                ? "text-black bg-accent"
                : "text-white"
            } border-b-2 border-transparent hover:border-accent focus:outline-none focus:border-accent`}
          >
            Personal Details
          </TabsTrigger>
          <TabsTrigger
            value="OtherDetails"
            className={`py-2 px-4 ${
              activeTab === "OtherDetails"
                ? "text-black bg-accent"
                : "text-white"
            } border-b-2 border-transparent hover:border-accent focus:outline-none focus:border-accent`}
          >
            Other Details
          </TabsTrigger>
          <TabsTrigger
            value="MembershipDetails"
            className={`py-2 px-4 ${
              activeTab === "MembershipDetails"
                ? "text-black bg-accent"
                : "text-white"
            } border-b-2 border-transparent hover:border-accent focus:outline-none focus:border-accent`}
          >
            Membership Details
          </TabsTrigger>
        </TabsList>
        {activeTab === "PersonalDetails" && (
          <TabsContent value="PersonalDetails" className="w-full">
            <LabelledInput
              formId="Name"
              formName="Name"
              autoComplete="name"
              label="Name*"
              placeholder="Member Name"
              onBlur={() =>
                validateField("name", createMemberInput.name.trim())
              }
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
              label="Email*"
              placeholder="@gmail.com"
              value={createMemberInput.email}
              onBlur={() =>
                validateField("email", createMemberInput.email.trim())
              }
              onChange={(e) => {
                setCreateMemberInput({
                  ...createMemberInput,
                  email: e.target.value.trim(),
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
              label="Contact*"
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
              label="Birth Date*"
              placeholder={"Enter Date"}
              selectedDate={createMemberInput.dob}
              value={
                createMemberInput.dob
                  ? createMemberInput.dob.toString()
                  : undefined
              }
              pickDate={(date) => {
                setCreateMemberInput({ ...createMemberInput, dob: date! });
              }}
              type="Calendar"
              required
              bulk
            />
            <SelectGender
              gender={createMemberInput.gender}
              setGender={(value: string) =>
                setCreateMemberInput({ ...createMemberInput, gender: value })
              }
              bulk
            />
            <LabelledInput
              formId="Address"
              formName="Address"
              autoComplete="address"
              label="Address*"
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
        )}
        {activeTab === "OtherDetails" && (
          <TabsContent value="OtherDetails">
            <LabelledInput
              formId="goals"
              formName="goals"
              autoComplete="goals"
              label="Goals"
              placeholder="Your Fitness goals"
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
              label="Join Date*"
              placeholder="Date of joining"
              selectedDate={createMemberInput.enrollmentDate}
              value={
                createMemberInput.enrollmentDate
                  ? createMemberInput.enrollmentDate.toString()
                  : undefined
              }
              pickDate={(date) => {
                setCreateMemberInput({
                  ...createMemberInput,
                  enrollmentDate: date!,
                });
              }}
              type="Calendar"
              required
              bulk
            />
          </TabsContent>
        )}
        {activeTab === "MembershipDetails" && (
          <TabsContent value="MembershipDetails">
            <SelectPrograms
              gymId={gymId!}
              programId={programId}
              setProgramId={setProgramId}
              bulk
            />

            <SelectBatches
              gymId={gymId!}
              programId={programId}
              batchId={batchId}
              setBatchId={setBatchId}
              bulk
            />
          </TabsContent>
        )}
      </Tabs>
      {generalError && (
        <p className="text-red-500 mb-4 text-center">{generalError}</p>
      )}
      <Button
        variant={"bulkForm"}
        onClick={
          activeTab === "MembershipDetails"
            ? handleSubmit
            : activeTab === "PersonalDetails"
            ? () => setActiveTab("OtherDetails")
            : () => setActiveTab("MembershipDetails")
        }
        disabled={activeTab === "MembershipDetails" && loading} // Disable button during submission
        className="bg-accent text-white hover:bg-accent focus:outline-none focus:ring focus:ring-black mt-8 md:mt-4 w-full"
      >
        {activeTab === "MembershipDetails"
          ? loading
            ? "Submitting..."
            : "Submit"
          : "Next"}
      </Button>
    </div>
  );
};
