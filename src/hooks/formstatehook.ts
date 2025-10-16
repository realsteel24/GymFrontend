// src/hooks/useForm.ts
import { useCallback, useState } from "react";

export type FormValues = Record<string, any>;

export function useForm(initialValues: FormValues = {}) {
  const [formData, setFormData] = useState<FormValues>(initialValues);

  const setFieldValue = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Generic handler in case you want to use it, but we will prefer setFieldValue
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Only update if name is present
      if (name) setFieldValue(name, value);
    },
    [setFieldValue]
  );

  const resetForm = useCallback(() => setFormData(initialValues), [initialValues]);

  const setForm = useCallback((newValues: FormValues) => setFormData(newValues), []);

  return {
    formData,
    setFieldValue,
    handleChange,
    resetForm,
    setForm,
  };
}