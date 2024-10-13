import { CreateMemberBulk } from "@/components/forms/BulkFormMP";
import { Screen } from "@/components/Screen";
import { useEffect } from "react";

export const BulkForm = () => {
  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <div className="relative bg-gym bg-cover bg-center h-screen w-full md:bg-contain lg:bg-cover flex flex-col justify-center items-center">
      <Screen />
      <div className="max-w-screen-md mx-auto px-4">
        {" "}
        {/* Add container for responsive width */}
        <CreateMemberBulk />
      </div>
    </div>
  );
};
