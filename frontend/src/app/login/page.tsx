import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { GoogleIcon } from "@/components/icon/google-icon";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  // If already logged in, redirect to dashboard or callback
  if (session) {
    redirect(callbackUrl ?? "/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
          </Button>
          <Link href="/" className="text-2xl font-bold text-foreground">
            Aisthesis
          </Link>
        </div>
        <ModeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-base">
              Masuk untuk menganalisis produk makanan Anda dengan AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <form
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: callbackUrl ?? "/dashboard",
                });
              }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium"
              >
                <GoogleIcon />
                Masuk dengan Google
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Keamanan Terjamin
                </span>
              </div>
            </div>

            {/* Security Info */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-primary mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Data Anda dienkripsi dan disimpan dengan aman</span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-primary mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Autentikasi aman dengan akun Google Anda</span>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-primary mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Analisis cepat dengan teknologi AI terkini</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>
          Dengan masuk, Anda menyetujui{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Ketentuan Layanan
          </Link>{" "}
          dan{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Kebijakan Privasi
          </Link>{" "}
          kami.
        </p>
      </footer>
    </div>
  );
}
