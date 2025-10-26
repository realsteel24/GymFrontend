import { useState } from "react";
import { Package } from "lucide-react";
import { BACKEND_URL } from "@/config";
import { LabelledInput } from "../LabelledInput";
import { Button } from "../ui/button";
import { CustomDialogForm } from "../CustomDialogForm";
import { toast } from "../ui/use-toast";

interface CreateItemProps {
  gymId: string;
  onSuccess?: (data: { id: string }) => void;
}

export default function CreateItem({ gymId, onSuccess }: CreateItemProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/admin/${gymId}/createitem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token") ?? "",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create item");
      }

      setFormData({ name: "", description: "" });
      setIsDialogOpen(false);
      setIsDrawerOpen(false);

      toast({
        title: "Item successfully created",
        description: "Your item has been added to inventory",
      });

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      toast({
        title: "Error creating item",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <CustomDialogForm
      isOpen={isDialogOpen}
      isMobileOpen={isDrawerOpen}
      setIsOpen={setIsDialogOpen}
      setIsMobileOpen={setIsDrawerOpen}
      icon={<Package className="w-5 h-5 mr-2 text-blue-600" />}
      FormTitle="Add New Product"
      FormDescription="Please add all the necessary fields and click save"
      drawerTitle="Add New Product"
      drawerDescription="Please add all the necessary fields and click save"
      titleButton="Add Product"
      children={
        <div>
          <LabelledInput
            formId="name"
            formName="name"
            label="Product"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          <LabelledInput
            formId="description"
            formName="description"
            label="Description"
            placeholder="Add details about this Product"
            onChange={handleChange}
            value={formData.description}
            disabled={loading}
          />
        </div>
      }
      button={
        <Button
          type="submit"
          onClick={handleSubmit}
          variant={"outline"}
          disabled={loading}
          className="bg-accent text-white dark:text-black"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      }
    />
  );
}
