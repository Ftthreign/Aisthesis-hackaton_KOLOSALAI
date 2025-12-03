import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import GoogleSignInButton from "@/components/auth/GoogleSignInButton"
import FoodIcon from "@/components/ui/FoodIcon"

export default async function SignInPage() {
  const session = await auth()

  // If already signed in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-900 dark:via-orange-950 dark:to-red-950">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              <FoodIcon type="dish" className="w-8 h-8" />
              <span>Aisthesis</span>
            </Link>
          </header>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Tingkatkan Bisnis Makanan Anda dengan{" "}
                  <span className="text-orange-600 dark:text-orange-400">
                    AI
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Platform pintar untuk menganalisis foto menu makanan Anda.
                  Dapatkan insight dan rekomendasi untuk meningkatkan bisnis
                  kuliner UMKM.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <FoodIcon type="dish" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Analisis Foto Menu
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload foto makanan Anda dan dapatkan analisis mendalam
                      tentang penyajian
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <FoodIcon type="spices" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Rekomendasi Perbaikan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dapatkan saran praktis untuk meningkatkan tampilan dan
                      kualitas penyajian makanan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <FoodIcon type="rice" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Insight Penjualan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pelajari bagaimana foto makanan yang menarik dapat
                      meningkatkan minat pelanggan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Manajemen Produk Mudah
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Kelola dan pantau semua produk makanan Anda dari satu
                      dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sign In Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Masuk ke Akun Anda
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gunakan akun Google untuk mulai menggunakan platform
                  </p>
                </div>

                {/* Google Sign In Button */}
                <GoogleSignInButton className="mt-6" />

                {/* Security Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Login aman dan terenkripsi
                      </span>
                      <br />
                      Data Anda dilindungi dengan teknologi keamanan terbaru
                    </p>
                  </div>
                </div>

                {/* Back to Home */}
                <div className="pt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                  >
                    ← Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 pt-8 border-t border-orange-200 dark:border-orange-900">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  100%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gratis untuk UMKM
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  <span className="text-lg">⚡</span> Cepat
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analisis dalam hitungan detik
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  <span className="text-lg">🔒</span> Aman
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data Anda terlindungi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

