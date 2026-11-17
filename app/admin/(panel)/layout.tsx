import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Atelier",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-ink md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">{children}</div>
    </div>
  );
}
