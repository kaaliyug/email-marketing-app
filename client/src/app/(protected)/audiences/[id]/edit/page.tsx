"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AudienceForm, { AudienceFormValues, } from "@/components/forms/AudienceForm";
import { updateAudience } from "@/services/audience.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAudiencePage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <EditAudienceClient
      audienceId={id}
    />
  );
}

function EditAudienceClient({
  audienceId,
}: {
  audienceId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValues: AudienceFormValues = {
    name: searchParams.get("name") ?? "",
    filterField:
      searchParams.get("filterField") ?? "",
    filterValue:
      searchParams.get("filterValue") ?? "",
  };

  const handleSubmit = async (
    data: AudienceFormValues
  ) => {
    await updateAudience(audienceId, data);

    router.push("/audiences");
    router.refresh();
  };

  return (
    <div className="wrapper-form">
      <h3> Edit Audience</h3>
      <AudienceForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText="Update Audience"
      />
    </div>
  );
}