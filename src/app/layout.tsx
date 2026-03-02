import type { Metadata } from "next";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { AuthProvider } from "@/app/context/AuthContext";
import "@/styles/tailwind.css";
import "@/styles/fonts.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dashboard CMS",
  description: "Global Dashboard Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
