import { useNavigate, useParams } from "react-router-dom";
import { CreateFeeCategory } from "../forms/CreateFeeCategory";
import { ViewFeeCategories } from "@/pages/tables/FeeCategories";
import { CardMenu } from "../CardMenu";

export function FeeCategoryCard() {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-4 mx-6 my-6">
      <CardMenu
        cardTitle="Create Package"
        type="elementCard"
        children={<CreateFeeCategory />}
      />
      <CardMenu
        cardTitle="View Fee Plans"
        type="buttonedCard"
        cardFunction={() => ViewFeeCategories(gymId ?? "", navigate)}
        buttonTitle="Fee Packages"
      />
    </div>
  );
}
