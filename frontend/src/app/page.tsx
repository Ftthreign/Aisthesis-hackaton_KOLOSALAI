import { auth } from "@/lib/auth";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Page() {
  const session = await auth();

  return <LandingPage session={session} />;
}
