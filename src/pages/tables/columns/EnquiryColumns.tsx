import { ColumnDef } from "@tanstack/react-table";
import { EnquiryInput } from "realsteelgym";
import dateFormat from "dateformat";
import { TextEnquiry } from "@/components/whatsapp/TextEnquiry";
import { WhatsappButton } from "@/components/whatsapp/WhatsappButton";
import { BACKEND_URL } from "@/config";
import { Check } from "lucide-react";

export const EnquiryColumns = (gymId: string): ColumnDef<EnquiryInput>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "enquiryDate",
    header: "Date",
    cell: ({ row }: { row: { original: EnquiryInput } }) => {
      const leadDate = row.original.enquiryDate ?? "N/A";
      return dateFormat(leadDate, "dd/mm/yyyy");
    },
  },

  {
    accessorKey: "programs",
    header: "Program",
    cell: ({ row }: { row: { original: EnquiryInput } }) => {
      const programs = Array.isArray(row.original.programs)
        ? row.original.programs.join(", ")
        : row.original.programs || "No Programs";
      return <span>{programs}</span>;
    },
  },
  {
    accessorKey: "batchPref",
    header: "Preference",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    header: "Send Info",
    cell: ({ row }) => (
      <div>
        {row.original.isMsgd ? (
          <Check className="ml-2" />
        ) : (
          <WhatsappButton
            fn={async () => {
              redirectToExternal(
                row.original.contact,
                row.original.name,
                row.original.programs,
                gymId
              );
              try {
                const response = await fetch(
                  `${BACKEND_URL}/api/v1/admin/${gymId}/enquiries/${row.original.id}`,
                  {
                    method: "PUT",
                    body: JSON.stringify({
                      isMsgd: true,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                      authorization: localStorage.getItem("token") ?? "",
                    },
                  }
                );
                if (!response.ok) {
                  throw new Error("Status Update failed");
                }
                window.location.reload();
              } catch (e) {
                console.log(e);
              }
            }}
          />
        )}
      </div>
    ),
  },
  // {
  //   header: "Message Sent",
  //   cell: ({ row }) => <div>{row.original.isMsgd ? <Check /> : <X />}</div>,
  // },
];

const redirectToExternal = (
  phone: string,
  name: string,
  programs: string[] | string,
  gymId: string
): void => {
  const programsString = Array.isArray(programs)
    ? programs.join(", ")
    : programs;
  const message = TextEnquiry(name, programsString, gymId);
  const encodedMessage = encodeURIComponent(message);
  const formattedPhone = trimPhoneNumber(phone);
  const url = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
  window.open(url, "_blank");
};

const trimPhoneNumber = (phoneNumber: string): string | null => {
  const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

  if (!cleanedNumber || cleanedNumber.length < 10) {
    return null; // Invalid phone number
  }

  if (cleanedNumber.startsWith("+91")) {
    // Already in international format
    return cleanedNumber.replace("+", "");
  } else if (cleanedNumber.startsWith("0")) {
    return "91" + cleanedNumber.substring(1);
  } else if (cleanedNumber.length === 10) {
    // If it's a 10-digit number, prepend the country code
    return "91" + cleanedNumber;
  } else {
    // Return null if it's an invalid number
    return null;
  }
};
