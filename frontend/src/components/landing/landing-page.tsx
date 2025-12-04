import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Session } from "next-auth";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import FoodIcon from "@/components/ui/FoodIcon";
import { GoogleIcon } from "../icon/google-icon";

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
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center p-4">
        <div className="container mx-auto max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Tingkatkan Bisnis Makanan Anda dengan{" "}
              <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Platform pintar untuk menganalisis foto menu makanan Anda.
              Dapatkan insight dan rekomendasi untuk meningkatkan bisnis kuliner
              UMKM.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              {session ? (
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                  <Link href="/dashboard/upload">Unggah Foto Kamu!</Link>
                </Button>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/dashboard/upload" });
                  }}
                >
                  <Button type="submit" size="lg" className="h-14 px-8 text-lg">
                    Analisis Foto Kamu Sekarang!
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
              <div className="shrink-0 mt-1">
                <FoodIcon type="dish" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Analisis Foto Menu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload foto makanan Anda dan dapatkan analisis mendalam
                  tentang penyajian
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
              <div className="shrink-0 mt-1">
                <FoodIcon type="spices" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Rekomendasi Perbaikan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dapatkan saran praktis untuk meningkatkan tampilan dan
                  kualitas penyajian makanan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
              <div className="shrink-0 mt-1">
                <FoodIcon type="rice" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  Insight Penjualan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pelajari bagaimana foto makanan yang menarik dapat
                  meningkatkan minat pelanggan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
              <div className="shrink-0 mt-1">
                <svg
                  className="w-8 h-8 text-primary"
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
                <h3 className="font-semibold text-foreground text-lg">
                  Manajemen Produk Mudah
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kelola dan pantau semua produk makanan Anda dari satu
                  dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="pt-8 border-t border-border">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  100%
                </div>
                <p className="text-sm text-muted-foreground">
                  Gratis untuk UMKM
                </p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  ⚡ Cepat
                </div>
                <p className="text-sm text-muted-foreground">
                  Analisis dalam hitungan detik
                </p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  🔒 Aman
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
