import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "@/core/lib/ReactQueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM CONTACT",
  description: "CRM de gestion des activités de la holding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={cn(
          "min-h-screen antialiased font-sans",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>

        <Toaster richColors position="bottom-right" closeButton />
      </body>
    </html>
  );
}