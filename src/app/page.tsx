import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Redirect authenticated users to the chat interface
  redirect("/c");
}
