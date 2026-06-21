import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import type { User } from "@/types/user";

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
  let user: User;

  try {
    user = await getMe();
  } catch {
    redirect("/sign-in");
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
