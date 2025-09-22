import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  const user = await currentUser();

  // Serialize user data for client component
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        emailAddresses: user.emailAddresses.map((email) => ({
          emailAddress: email.emailAddress,
        })),
      }
    : null;

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Client Component - handles both mobile and desktop layouts */}
      <HomeClient user={serializedUser} />
    </div>
  );
}
