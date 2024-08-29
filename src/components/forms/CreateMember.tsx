import { Button } from "@/components/ui/button";

import { BACKEND_URL } from "@/config";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomDialogForm } from "../CustomDialogForm";
import { LabelledInput } from "../LabelledInput";
import { useToast } from "../ui/use-toast";

export const CreateMember = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState<Date>(new Date());
  const [gender, setGender] = useState("Undefined");
  const [enrollmentDate, setEnrollmentDate] = useState<Date>(new Date());

  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clear = () => {
    setName("");
    setEmail("");
    setContact("");
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
          name,
          email,
          contact,
          dob,
          gender,
          enrollmentDate,
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
            <LabelledInput
              formId="Name"
              formName="Name"
              autoComplete="name"
              label="Name"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
            <LabelledInput
              formId="Email"
              formName="Email"
              autoComplete="email"
              label="Email"
              placeholder="@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <LabelledInput
              formId="Contact"
              formName="Contact"
              autoComplete="phone"
              label="Contact"
              placeholder="Contact Number"
              onChange={(e) => setContact(e.target.value)}
            />
            <LabelledInput
              formId="Gender"
              formName="Gender"
              autoComplete="gender"
              label="Gender"
              placeholder="eg. Female"
              onChange={(e) => setGender(e.target.value)}
            />
            <LabelledInput
              formId="Birth Date"
              formName="Birth Date"
              label="Birth Date"
              placeholder={"Enter Date"}
              selectedDate={dob}
              pickDate={(date) => setDob(date)}
              type="Calendar"
            />

            <LabelledInput
              formId="Enroll"
              formName="Enroll"
              label="Enrollment Date"
              placeholder="Date of joining"
              selectedDate={enrollmentDate}
              pickDate={(date) => setEnrollmentDate(date)}
              type="Calendar"
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
