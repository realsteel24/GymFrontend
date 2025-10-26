import { useState } from "react";
import { Package } from "lucide-react";
import { BACKEND_URL } from "@/config";
import { LabelledInput } from "../LabelledInput";
import { Button } from "../ui/button";
import { CustomDialogForm } from "../CustomDialogForm";
import { toast } from "../ui/use-toast";
import SelectItems from "../selectors/SelectItem";
import { useForm } from "@/hooks/formstatehook";

interface CreateSubItemProps {
  gymId: string;
  onSuccess?: (data: { id: string }) => void;
}
export default function CreateSubItem({
  gymId,
  onSuccess,
}: CreateSubItemProps) {
  const { formData, setFieldValue, handleChange, resetForm } = useForm({
    variant: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!formData.variant.trim()) {
      toast({
        title: "Validation Error",
        description: "Variant is required",
        variant: "destructive",
      });
      return;
    }

    if (
      parseFloat(formData.costPrice) < 0 ||
      parseFloat(formData.sellingPrice) < 0 ||
      parseInt(formData.stock) < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Values cannot be negative",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/createsubitem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
          body: JSON.stringify({
            itemId: formData.itemId,
            name: formData.variant.trim(),
            costPrice: parseFloat(formData.costPrice),
            sellingPrice: parseFloat(formData.sellingPrice),
            stock: parseInt(formData.stock),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create subitem");

      resetForm();
      setIsDialogOpen(false);
      setIsDrawerOpen(false);
      toast({
        title: "SubItem created",
        description: "Your Variant has been added to Inventory",
      });
      onSuccess?.(data);
    } catch (err) {
      toast({
        title: "Error creating subitem",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialogForm
      isOpen={isDialogOpen}
      isMobileOpen={isDrawerOpen}
      setIsOpen={setIsDialogOpen}
      setIsMobileOpen={setIsDrawerOpen}
      icon={<Package className="w-5 h-5 mr-2 text-blue-600" />}
      FormTitle="Add New Product Variant"
      FormDescription="Add variant details below"
      drawerTitle="Add New Product Variant"
      drawerDescription="Please add all necessary fields and click save"
      titleButton="Add Variant"
      children={
        <div className="space">
          <SelectItems
            gymId={gymId}
            setItemId={(id) => setFieldValue("itemId", id)}
          />
          <LabelledInput
            formId="variant"
            formName="variant"
            label="Variant"
            placeholder="Product Type"
            value={formData.variant}
            onChange={handleChange}
            disabled={loading}
          />

          <LabelledInput
            formId="costPrice"
            formName="costPrice"
            label="Cost Price"
            type="number"
            placeholder="0.00"
            value={formData.costPrice}
            onChange={handleChange}
            disabled={loading}
            min={0}
          />
          <LabelledInput
            formId="sellingPrice"
            formName="sellingPrice"
            label="Selling Price"
            type="number"
            placeholder="0.00"
            value={formData.sellingPrice}
            onChange={handleChange}
            disabled={loading}
            min={0}
          />
          <LabelledInput
            formId="stock"
            formName="stock"
            label="Initial Stock"
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            disabled={loading}
            min={0}
          />
        </div>
      }
      button={
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="outline"
          disabled={loading}
          className="bg-accent text-white dark:text-black"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      }
    />
  );
}
