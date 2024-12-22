import { BatchCard } from "@/components/cards/BatchCard";
import { FeeCategoryCard } from "@/components/cards/FeeCategoryCard";
import { InstructorCard } from "@/components/cards/InstructorCard";
import { MemberCard } from "@/components/cards/MemberCard";
import { PaymentCard } from "@/components/cards/PaymentCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { useGymNameContext } from "@/context/Gym";
import { EnquiryCard } from "@/components/cards/EnquiryCard";

export function GymProfile({ component }: { component: string }) {
  const [activeComponent, setActiveComponent] = useState(component);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { gymName, loading } = useGymNameContext();
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Program":
        return <ProgramCard />;
      case "Batch":
        return <BatchCard />;
      case "Member":
        return <MemberCard />;
      case "FeeStructure":
        return <FeeCategoryCard />;
      case "Payment":
        return <PaymentCard />;
      case "Instructor":
        return <InstructorCard />;
      case "Enquiry":
        return <EnquiryCard />;
      case "":
        return null;
      default:
        return <Dashboard />;
    }
  };
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <div className="flex justify-center text-2xl py-4 underline underline-offset-8 decoration-4 decoration-accent font-semibold">
        {loading ? "loading.." : gymName}
      </div>

      <div className=" lg:hidden block ">
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleDropdownToggle}
            type="button"
            role="combobox"
            aria-controls="radix-:Rndt6la:"
            aria-expanded="false"
            aria-autocomplete="none"
            dir="ltr"
            data-state="closed"
            className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input dark:bg-black bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 w-[250px]"
          >
            <span className="pointer-events:none">{activeComponent}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-50"
              aria-hidden="false"
            >
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-10 w-60 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {[
                  "Dashboard",
                  "Enquiry",
                  "Member",
                  "Payment",
                  "Program",
                  "Batch",
                  "FeeStructure",
                  "Instructor",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleComponentChange(option)}
                    className={` block items-center  hover:font-bold justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 mr-2 ${
                      activeComponent === option
                        ? "underline underline-offset-4 decoration-2"
                        : null
                    }`}
                    role="menuitem"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-evenly">
        <div className="flex justify-center mx-auto mx-5 border-2 rounded-xl py-1 lg:block hidden px-4">
          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Dashboard")}
            className={`inline-flex items-center hover:font-bold justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-9 px-4 py-2 mr-2  ${
              activeComponent === "Dashboard"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Dashboard
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Enquiry")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "Enquiry"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Enquiry
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Member")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "Member"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Members
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Payment")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "Payment"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Payments
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Program")}
            className={`inline-flex items-center hover:font-bold justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-9 px-4 py-2 mr-2  ${
              activeComponent === "Program"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Programs
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Batch")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "Batch"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Batches
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("FeeStructure")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "FeeStructure"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            FeeStructure
          </Button>

          <Button
            variant={"default"}
            onClick={() => setActiveComponent("Instructor")}
            className={`inline-flex items-center justify-center hover:font-bold whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 rounded-xl mr-2 ${
              activeComponent === "Instructor"
                ? "underline underline-offset-4 decoration-2"
                : null
            }`}
          >
            Instructors
          </Button>
        </div>
      </div>
      <Toaster />
      <div>{renderComponent()}</div>
    </div>
  );
}

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";

// export function GymProfile() {
//   const [activeComponent, setActiveComponent] = useState("Members");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleComponentChange = (component) => {
//     setActiveComponent(component);
//     setIsDropdownOpen(false);
//   };

//   return (
//     <div>
//       <div className="flex justify-center text-2xl py-4 underline underline-offset-8 decoration-4 decoration-accent font-semibold">
//         Mohan's Planet
//       </div>
//       <div className="lg:hidden block">
//         <div className="flex justify-center">
//           <div className="relative inline-block text-left">
//             <Button
//               type="button"
//               onClick={handleDropdownToggle}
//               className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <span className="pointer-events:none">{activeComponent}</span>
//               <svg
//                 className="h-4 w-4 opacity-50"
//                 viewBox="0 0 15 15"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
//                   fill="currentColor"
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                 ></path>
//               </svg>
//             </Button>
//             {isDropdownOpen && (
//               <div className="absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-50">
//                 <div
//                   className="py-1"
//                   role="menu"
//                   aria-orientation="vertical"
//                   aria-labelledby="options-menu"
//                 >
//                   {[
//                     "Programs",
//                     "Batches",
//                     "Members",
//                     "FeeStructure",
//                     "Payments",
//                     "Instructors",
//                   ].map((option) => (
//                     <button
//                       key={option}
//                       onClick={() => handleComponentChange(option)}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                       role="menuitem"
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-evenly">
//         <div className="flex justify-center mx-auto mx-5 border-2 rounded-xl py-1 lg:block hidden px-4">
//           {[
//             "Programs",
//             "Batches",
//             "Members",
//             "FeeStructure",
//             "Payments",
//             "Instructors",
//           ].map((component) => (
//             <Button
//               key={component}
//               variant={"default"}
//               onClick={() => setActiveComponent(component)}
//               className={`inline-flex items-center hover:font-bold justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  h-9 px-4 py-2 mr-2 ${
//                 activeComponent === component
//                   ? "underline underline-offset-4 decoration-2"
//                   : null
//               }`}
//             >
//               {component}
//             </Button>
//           ))}
//         </div>
//       </div>
//       <div>{renderComponent()}</div>
//     </div>
//   );
// }
