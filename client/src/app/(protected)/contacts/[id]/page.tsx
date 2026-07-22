"use client";

import ContactForm, { ContactFormValues } from "@/components/forms/ContactForm"
import { getContactById, updateContact } from "@/services/contact.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditContactPage () {

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);    
    const [contact, setContact] = useState<ContactFormValues | null>(null);

    useEffect(() => {
        const fetchContact = async() => {
            try {
                const data = await getContactById(id);
                 setContact({
                    name: data.name,
                    email: data.email,
                    phone: data.phone ?? "",
                    customFields: {
                        city:data.customFields?.city ?? "",
                        company:data.customFields?.company ?? "",
                        tag:data.customFields?.tag ?? "",
                    }
                });
            } catch (error) {
                console.error(error);
                alert("Failed to load contact");
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, [id]);

    const handleUpdate = async ( values: ContactFormValues ) => {
        try {
            await updateContact(id, values);
            router.push("/contacts");
            router.refresh();
        } catch (error ) {
            console.error(error);
            alert("Failed to update contact");
        }
    };
    
    if (loading) { return <p>Loading...</p>; }

    if (!contact) { return <p>Contact not found.</p>; }

    return (
        <>
            <div className="wrapper-form">
                 <h3>Edit Contact</h3>
                 <ContactForm initialValues={contact} submitLabel="Update Contact" onSubmit={handleUpdate} />
            </div>
        </>
    );
}