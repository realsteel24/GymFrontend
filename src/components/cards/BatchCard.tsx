import { useNavigate, useParams } from "react-router-dom";
import { ViewBatches } from "@/pages/tables/Batches";
import { CreateBatch } from "../forms/CreateBatch";
import { CardMenu } from "../CardMenu";

export function BatchCard() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="Create New Batch"
        type="elementCard"
        children={<CreateBatch />}
      />
      <CardMenu
        cardTitle="Manage Batches"
        type="buttonedCard"
        cardFunction={() => ViewBatches("all", gymId ?? "", navigate)}
        buttonTitle="View Batches"
      />
    </div>
  );
}
