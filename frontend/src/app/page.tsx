import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function Page() {
  // const session = await auth();

  // // Redirect to signin page if not logged in
  // if (!session) {
  //   redirect("/auth/signin");
  // }

  return <LandingPage session={null} />;
}
