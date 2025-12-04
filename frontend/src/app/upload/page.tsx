import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/theme/ModeToggle";

export default async function UploadPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <Link
              href="/"
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
            >
              Aisthesis
            </Link>
            <div className="flex gap-4 items-center">
              <ModeToggle />
              <Link
                href="/dashboard"
                className="px-4 py-2 text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                Dashboard
              </Link>
            </div>
          </header>

          {/* Upload Section */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Upload Image
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              Upload an image to analyze and get insights.
            </p>

            {/* Upload Form */}
            <form
              action={async (formData: FormData) => {
                "use server";
                // TODO: Implement file upload logic
                console.log("File upload:", formData.get("file"));
              }}
              className="space-y-6"
            >
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-12 text-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                <input
                  type="file"
                  name="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  id="file-input"
                  required
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-5xl mb-4">📁</div>
                  <div className="text-zinc-900 dark:text-zinc-50 font-medium mb-2">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    PNG, JPG, WEBP up to 10MB
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors font-medium"
                >
                  Upload & Analyze
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
