import { ViewPrograms } from "@/pages/tables/Programs";
import { useNavigate, useParams } from "react-router-dom";
import { CardMenu } from "../CardMenu";
import CreateItem from "../forms/CreateItem";
import CreateSubItem from "../forms/CreateSubItem";

export function InventoryCard() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="Product Log"
        type="elementCard"
        children={
          <CreateItem
            gymId={gymId!}
            onSuccess={() => navigate(`/gym/${gymId}/dashboard`)}
          />
        }
      />
      <CardMenu
        cardTitle="Product Type"
        type="elementCard"
        children={<CreateSubItem gymId={gymId!} />}
      />
      <CardMenu
        cardTitle="Manage Inventory "
        type="buttonedCard"
        cardFunction={() => ViewPrograms(gymId ?? "", navigate)}
        buttonTitle="View Inventory"
      />
    </div>
  );
}
