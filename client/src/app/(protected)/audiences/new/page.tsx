"use client";

import { useRouter } from "next/navigation";
import AudienceForm, {
  AudienceFormValues,
} from "@/components/forms/AudienceForm";
import { createAudience } from "@/services/audience.service";

export default function NewAudiencePage() {
  const router = useRouter();

  const handleSubmit = async (
    data: AudienceFormValues
  ) => {
    await createAudience(data);

    router.push("/audiences");

    router.refresh();
  };

  return (
    <div className="wrapper-form">
      <h3> Create Audience </h3>
      <AudienceForm onSubmit={handleSubmit} submitText="Create Audience"  />
    </div>
  );
}