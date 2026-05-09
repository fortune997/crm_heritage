import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Se Connecter - HERITAGE",
    description: "Page de connexion du CRM Heritage",
};

export default function DashBoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <body className="min-h-full flex flex-col">{children}</body>
        </div>
    );
}
