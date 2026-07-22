"use client";

import { useForm } from "react-hook-form";

export interface ContactFormValues {
    name: string;
    email: string;
    phone?: string;
    customFields?: {
        city?: string;
        company?: string;
        tag?: string;
    };
}

interface Props {
    initialValues?: ContactFormValues;
    submitLabel?: string;
    onSubmit: ( data: ContactFormValues ) => Promise<void>;
}

export default function ContactForm({ initialValues, submitLabel = "Create Contact", onSubmit, }: Props) {
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<ContactFormValues>({ defaultValues: initialValues, });

    return (

        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input {...register("name", {required: "Name is required", })} className="w-full" />
                    {errors.name && (<p className="text-red-500 text-sm"> {errors.name.message} </p> )}
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" {...register("email", { required: "Email is required", })} className="w-full"  />
                    {errors.email && (<p className="text-red-500 text-sm"> {errors.email.message} </p>)}
                </div>
                <div>
                    <label>Phone</label>
                    <input {...register("phone")} className="w-full"  />
                </div>
                
                <div>
                    <label>City</label>
                    <input {...register("customFields.city")} placeholder="Mumbai" className="w-full" />
                </div>

                <div>
                    <label>Company</label>
                    <input {...register("customFields.company")} placeholder="Google" className="w-full"  />
                </div>
                
                <div>
                    <label>Tag</label>
                    <input {...register("customFields.tag")} placeholder="VIP" className="w-full" />
                </div>

                <button type="submit" disabled={isSubmitting} className="text-white rounded">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </form>
        </>
    );
}