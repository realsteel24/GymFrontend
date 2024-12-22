import { CreateProgram } from "../forms/CreateProgram";
import { ViewPrograms } from "@/pages/tables/Programs";
import { useNavigate, useParams } from "react-router-dom";
import { CardMenu } from "../CardMenu";

export function ProgramCard() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="Create New Program"
        type="elementCard"
        children={<CreateProgram />}
      />
      <CardMenu
        cardTitle="Manage Programs"
        type="buttonedCard"
        cardFunction={() => ViewPrograms(gymId ?? "", navigate)}
        buttonTitle="View Programs"
      />
    </div>
  );
}
