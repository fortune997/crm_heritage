import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "CRM - HERITAGE",
    description: "Page de connexion du CRM Heritage",
};

export default function DashBoardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="min-h-full flex flex-col">{children}</div>
        </div>
    );
}
