import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfilePage from "./ProfilePage.client";
import { getMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User profile page in NoteHub.",
  openGraph: {
    title: "Profile Page",
    description: "View and manage your profile in NoteHub.",
    url: "https://notehub.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile Page",
    description: "View and manage your profile in NoteHub.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default async function ProfileRoute() {
  let user;

  try {
    user = await getMe();
  } catch {
    redirect("/sign-in");
  }

  return <ProfilePage user={user} />;
}
