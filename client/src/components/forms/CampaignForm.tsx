"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getAudiences,  Audience, } from "@/services/audience.service";
import { getContacts, Contact } from "@/services/contact.service";

export interface ManualRecipient {
  id: string;
  name: string;
  email: string;
}

export interface CampaignFormValues {
  name: string;
  subject: string;
  body: string;
  audienceId?: string;
  manualRecipients?: ManualRecipient[];
  scheduledAt?: string;
}

interface CampaignFormProps {
  initialValues?: CampaignFormValues;
  onSubmit: (data: CampaignFormValues) => Promise<void>;
  submitText?: string;
}

export default function CampaignForm({ initialValues, onSubmit, submitText = "Save", }: CampaignFormProps) {
  const {register, handleSubmit, watch,  setValue, formState: { errors, isSubmitting }, } = useForm<CampaignFormValues>({
    defaultValues: initialValues ?? {
      name: "",
      subject: "",
      body: "",
      audienceId: "",
      manualRecipients: [],
      scheduledAt: "",
    },
  });
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const selectedRecipients = watch("manualRecipients") ?? [];
  const selectedAudience = watch("audienceId");
  

  const toggleRecipient = (contact: Contact) => {
    if (selectedAudience) {
    setValue("audienceId", "");
  }
    const exists = selectedRecipients.some((recipient) => recipient.id === contact.id);
    if (exists) {
      setValue("manualRecipients", selectedRecipients.filter(
        (recipient) => recipient.id !== contact.id ), { shouldDirty: true, shouldValidate: true} );
    } else {
      setValue("manualRecipients", [
        ...selectedRecipients, {
          id: contact.id,
          name: contact.name,
          email: contact.email,
        },
      ], {shouldDirty: true, shouldValidate: true,});
      }
};   
    useEffect(() => {
      register("manualRecipients");
    }, [register]);

      useEffect(() => {
        const loadData = async () => {
          try {
            const [audienceData, contactData] = await Promise.all([
              getAudiences(),
              getContacts(),
            ]);
            setAudiences(audienceData);
            setContacts(contactData.data.contacts);
          } catch (error) {
            console.error(error);
          }
        };
        loadData();
      }, []);

      console.log(contacts);

  return (
    <form onSubmit={handleSubmit((data) => { onSubmit({ ...data, 
      audienceId: data.audienceId || undefined,  
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,  }); 
    })}>
      <div>
        <label>Campaign Name </label>
        <input {...register("name", { required: "Campaign name is required", })} className="w-full" />
        {errors.name && ( <p className="text-red-500 text-sm"> {errors.name.message} </p> )} 
      </div>

      <div>
        <label>Subject </label>
        <input {...register("subject", { required: "Subject is required", })} className="w-full" />       
        {errors.subject && (<p className="text-red-500 text-sm"> {errors.subject.message} </p> )}
      </div>

      <div>
        <label>Email Body</label>
        <textarea rows={8} className="w-full"
          {...register("body", {
            required: "Body is required",
          })}          
        />
        {errors.body && ( <p className="text-red-500 text-sm"> {errors.body.message} </p> )} </div>      

    <div>
      <label> Audience</label>
      <select disabled={selectedRecipients.length > 0} {...register("audienceId")} className="w-full cursor-pointer"  
        onChange={(e) => {setValue("audienceId", e.target.value);
        if (e.target.value) {setValue("manualRecipients", []);}
      }}>
        <option value="">{audiences.length === 0 ? "Loading audiences..." : "Select Audience (Optional)"}</option>
        {audiences.map((audience) => (          
          <option key={audience.id} value={audience.id}> {audience.name}</option>
        ))}
      </select>
    </div>

  <div>
    <label>Manual Recipients</label>
    <div className="checkbox-container overflow-y-auto max-h-64 p-3 space-y-2">
      {contacts.length === 0 ? (<p className="text-gray-500">No contacts found.</p> ) : (
        contacts.map((contact) => (
          <label key={contact.id} className="flex items-center gap-3">
            <input type="checkbox" checked={selectedRecipients.some((recipient) => recipient.id === contact.id )} disabled={!!selectedAudience} onChange={() => toggleRecipient(contact)} />
            <span>{contact.name} ({contact.email})</span>
          </label>
        ))
      )}
    </div>
  </div>

      <div>
        <label> Schedule Later </label>
        <input
          type="datetime-local"
          {...register("scheduledAt")}
        />
      </div>

      <button type="submit" disabled={isSubmitting}> {isSubmitting ? "Saving..." : submitText} </button>
    </form>
  );
}