import { useNavigate, useParams } from "react-router-dom";
import { CreateMember } from "../forms/CreateMember";
import { ViewMembers } from "@/pages/tables/Members";
import { CardMenu } from "../CardMenu";
import { CreateMemberProgram } from "../forms/CreateMemberProgram";
import { CreateMemberFee } from "../forms/CreateMemberFee";
import { ViewMemberships } from "@/pages/tables/MemberFees";
import { CreateInventoryItem } from "../forms/CreateInventoryItem";

export function MemberCard() {
  const { gymId, id } = useParams<{
    gymId: string;
    id: string;
    memberId?: string;
  }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="Create New Member"
        type="elementCard"
        children={<CreateMember />}
      />

      <CardMenu
        cardTitle="Enroll Member"
        type="elementCard"
        children={<CreateMemberProgram />}
      />
      <CardMenu
        cardTitle="Record Payment"
        type="elementCard"
        children={<CreateMemberFee />}
      />
      <CardMenu
        cardTitle="Manage Memberships"
        type="buttonedCard"
        cardFunction={() => ViewMemberships(gymId ?? "", navigate)}
        buttonTitle="View Status"
      />
      <CardMenu
        cardTitle="Manage Member Details"
        type="buttonedCard"
        cardFunction={() => ViewMembers(id ?? "all", gymId ?? "", navigate)}
        buttonTitle="View Members"
      />
      <CardMenu
        cardTitle="Record Item Sale"
        type="elementCard"
        children={<CreateInventoryItem />}
      />
    </div>
  );
}
