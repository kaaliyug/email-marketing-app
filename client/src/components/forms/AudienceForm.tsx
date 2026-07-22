"use client";

import { useForm } from "react-hook-form";

export interface AudienceFormValues {
  name: string;
  filterField: string;
  filterValue: string;
}

interface AudienceFormProps {
  initialValues?: AudienceFormValues;
  onSubmit: (data: AudienceFormValues) => Promise<void>;
  submitText?: string;
}

export default function AudienceForm({
  initialValues,
  onSubmit,
  submitText = "Save",
}: AudienceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AudienceFormValues>({
    defaultValues: initialValues ?? {
      name: "",
      filterField: "",
      filterValue: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label> Name</label>
        <input
          {...register("name", {
            required: "Name is required",
          })}
          className="w-full"
        />
        {errors.name && ( <p className="text-red-500 text-sm mt-1"> {errors.name.message} </p> )}
      </div>

      <div>
        <label>Filter Field</label>        
        <select {...register("filterField", { required: "Filter field is required",})} className="w-full">
          <option value="">Select Filter Field</option>
          <option value="city">City</option>
          <option value="company">Company</option>
           <option value="tag">Tag</option>
        </select>

        {errors.filterField && (
          <p className="text-red-500 text-sm mt-1">
            {errors.filterField.message}
          </p>
        )}
      </div>

      <div>
        <label> Filter Value</label>
        <input
          {...register("filterValue", {
            required: "Filter value is required",
          })}
          className="w-full"
        />
        {errors.filterValue && (
          <p className="text-red-500 text-sm mt-1">
            {errors.filterValue.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}> {isSubmitting ? "Saving..." : submitText} </button>
    </form>
  );
}