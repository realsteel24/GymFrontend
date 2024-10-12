import { CreateMemberBulk } from "@/components/forms/BulkFormMP";
import { Screen } from "@/components/Screen";
import { useEffect } from "react";

export const BulkForm = () => {
  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div className="relative bg-gym-bg bg-cover bg-center h-screen w-full">
      {/* Background Screen component */}
      <Screen />

      {/* Foreground content */}
      <div className="relative flex justify-center items-center h-full z-10">
        <CreateMemberBulk />
      </div>
    </div>
  );
};
