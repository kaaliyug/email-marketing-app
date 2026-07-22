"use client";

import { useRouter } from "next/navigation";
import ContactForm, { ContactFormValues,} from "@/components/forms/ContactForm";
import { createContact } from "@/services/contact.service";

export default function NewContactPage() {

    const router = useRouter();

    const handleCreate = async ( data: ContactFormValues ) => {

        try {
            await createContact(data);
            router.push("/contacts");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to create contact");
        }
    };

    return (

        <div className="wrapper-form">
            <h3>Create Contact </h3>
            <ContactForm onSubmit={handleCreate}   />
        </div>
    );
}