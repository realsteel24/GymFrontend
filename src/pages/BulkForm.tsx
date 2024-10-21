import { CreateMemberBulk } from "@/components/forms/BulkFormMP";
import { useEffect } from "react";

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
      {/* <div className="hidden md:block">
        <Screen />
      </div> */}

      <div className="relative flex justify-center items-center h-full z-10">
        <div>
          <CreateMemberBulk />
        </div>
      </div>
    </div>
  );
};
