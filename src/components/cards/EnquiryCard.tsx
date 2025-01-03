import { useNavigate, useParams } from "react-router-dom";
import { CardMenu } from "../CardMenu";
import { Enquiry } from "../forms/Enquiry";
import { ViewEnquiries } from "@/pages/tables/Enquiries";

export function EnquiryCard() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="New Enquiry"
        type="elementCard"
        children={<Enquiry />}
      />
      <CardMenu
        cardTitle="Manage Enquiries"
        type="buttonedCard"
        cardFunction={() => ViewEnquiries(gymId ?? "", navigate)}
        buttonTitle="View Enquiries"
      />
    </div>
  );
}
