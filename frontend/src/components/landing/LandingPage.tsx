import Link from "next/link";
import { signIn } from "@/auth";
import { Session } from "next-auth";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="container mx-auto max-w-5xl w-full space-y-12 md:space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Welcome to Aisthesis
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your intelligent platform for image analysis and insights. Upload,
              analyze, and discover.
            </p>
            {!session && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                >
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Get Started with Google
                  </Button>
                </form>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/upload">Upload Image</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="text-3xl mb-2">📤</div>
                <CardTitle>Easy Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your images quickly and securely with our intuitive
                  interface.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="text-3xl mb-2">🔍</div>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced AI-powered analysis to extract insights from your
                  images.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="text-3xl mb-2">📊</div>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track and manage all your uploads from a centralized
                  dashboard.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {session && (
            <div className="text-center pt-4">
              <Button asChild size="lg">
                <Link href="/upload">Upload Your First Image</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
