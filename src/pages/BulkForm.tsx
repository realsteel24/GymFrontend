import { CreateMemberBulk } from "@/components/forms/BulkFormMP";
import { Screen } from "@/components/Screen";
import { useEffect } from "react";
import { CardTitle } from "@/components/ui/card";

export const BulkForm = () => {
  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div
      className="relative bg-japanese sm:bg-gym bg-cover bg-center h-screen w-full 
    flex flex-col justify-center items-center"
    >
      <Screen />

      <div className="relative flex justify-center items-center h-full z-10">
        <div>
          {" "}
          <CardTitle className="text-center pb-4 text-2xl text-accent">Mohan's Planet</CardTitle>
          <CreateMemberBulk />
        </div>
      </div>
    </div>
  );
};
