import { CreateMemberBulk } from "@/components/forms/BulkFormMP";
import { Screen } from "@/components/Screen";
import { useEffect } from "react";

export const BulkForm = () => {
  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div
      className="relative bg-gym-bg md:bg-gym bg-cover bg-center h-screen w-full 
    // md:bg-contain lg:bg-cover
    flex flex-col justify-center items-center"
    >
      <Screen />
      <div className="relative flex justify-center items-center h-full z-10">
        <CreateMemberBulk />
      </div>
    </div>
  );
};
