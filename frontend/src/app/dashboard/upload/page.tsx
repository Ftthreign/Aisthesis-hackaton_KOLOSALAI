import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UploadForm, UploadTips } from "@/components/dashboard/upload-form";

export default async function UploadPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <UploadForm />
        <UploadTips />
      </div>
    </div>
  );
}
