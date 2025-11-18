import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Account Settings",
  description: "Manage your account information, update your profile, and change security settings",
  openGraph: {
    title: "My Profile | Account Settings",
    description: "Update your personal information and account preferences",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
