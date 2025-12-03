import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <Link
              href="/"
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
            >
              Aisthesis
            </Link>
            <div className="flex gap-4 items-center">
              <Link
                href="/upload"
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
              >
                Upload Image
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Dashboard
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Welcome back, {session.user?.name || session.user?.email}!
              </p>
            </div>

            {/* Empty State */}
            <div className="py-20 text-center">
              <div className="text-6xl mb-6">📊</div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Your dashboard is empty
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                Start by uploading your first image to see it appear here.
              </p>
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors font-medium"
              >
                Upload Your First Image
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

