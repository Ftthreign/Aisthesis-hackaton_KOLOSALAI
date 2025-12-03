import Link from "next/link"
import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await auth()

  // Redirect to signin page if not logged in
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Aisthesis
            </div>
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <form
                action={async () => {
                  "use server"
                  await signIn("google")
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                >
                  Sign In
                </button>
              </form>
            )}
          </header>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Welcome to Aisthesis
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
              Your intelligent platform for image analysis and insights.
              Upload, analyze, and discover.
            </p>
            {!session && (
              <div className="flex gap-4 justify-center">
                <form
                  action={async () => {
                    "use server"
                    await signIn("google")
                  }}
                >
                  <button
                    type="submit"
                    className="px-8 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors font-medium"
                  >
                    Get Started with Google
                  </button>
                </form>
                <Link
                  href="/upload"
                  className="px-8 py-3 border-2 border-zinc-900 text-zinc-900 rounded-lg hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-colors font-medium"
                >
                  Upload Image
                </Link>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Easy Upload
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Upload your images quickly and securely with our intuitive
                interface.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                AI Analysis
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Advanced AI-powered analysis to extract insights from your
                images.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Dashboard
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Track and manage all your uploads from a centralized dashboard.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          {session && (
            <div className="text-center">
              <Link
                href="/upload"
                className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors font-medium"
              >
                Upload Your First Image
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
