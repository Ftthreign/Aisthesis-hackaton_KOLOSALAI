import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Session } from "next-auth";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Button } from "@/components/ui/button";
import FoodIcon from "@/components/ui/FoodIcon";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleIcon } from "../icon/GoogleIcon";

interface LandingPageProps {
  session: Session | null;
}

export function LandingPage({ session }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center shrink-0">
        <div className="text-2xl font-bold text-foreground">Aisthesis</div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button type="submit">Sign In</Button>
            </form>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center p-4">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Tingkatkan Bisnis Makanan Anda dengan{" "}
                  <span className="text-primary">AI</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Platform pintar untuk menganalisis foto menu makanan Anda.
                  Dapatkan insight dan rekomendasi untuk meningkatkan bisnis
                  kuliner UMKM.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <FoodIcon type="dish" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Analisis Foto Menu
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Upload foto makanan Anda dan dapatkan analisis mendalam
                      tentang penyajian
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <FoodIcon type="spices" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Rekomendasi Perbaikan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan saran praktis untuk meningkatkan tampilan dan
                      kualitas penyajian makanan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <FoodIcon type="rice" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Insight Penjualan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pelajari bagaimana foto makanan yang menarik dapat
                      meningkatkan minat pelanggan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <svg
                      className="w-6 h-6 text-primary"
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
                    <h3 className="font-semibold text-foreground">
                      Manajemen Produk Mudah
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Kelola dan pantau semua produk makanan Anda dari satu
                      dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <Card className="shadow-xl border-border">
              <CardContent>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {session ? "Selamat Datang Kembali!" : "Mulai Sekarang"}
                  </h2>
                  <p className="text-muted-foreground pb-4">
                    {session
                      ? "Lanjutkan analisis menu makanan Anda"
                      : "Gunakan akun Google untuk mulai menggunakan platform"}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {session ? (
                    <Button asChild size="lg" className="w-full">
                      <Link href="/upload">Upload Your First Image</Link>
                    </Button>
                  ) : (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await signIn("google");
                        }}
                      >
                        <Button type="submit" size="lg" className="w-full">
                          Get Started with <GoogleIcon />
                        </Button>
                      </form>
                    </>
                  )}
                </div>

                {/* Security Info */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0"
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
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Login aman dan terenkripsi
                      </span>
                      <br />
                      Data Anda dilindungi dengan teknologi keamanan terbaru
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <p className="text-sm text-muted-foreground">
                  Gratis untuk UMKM
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  <span className="text-lg">⚡</span> Cepat
                </div>
                <p className="text-sm text-muted-foreground">
                  Analisis dalam hitungan detik
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  <span className="text-lg">🔒</span> Aman
                </div>
                <p className="text-sm text-muted-foreground">
                  Data Anda terlindungi
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
