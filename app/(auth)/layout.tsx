


import { AppLogo } from "@/components/shared/AppLogo";
import LeftSideAuth from "@/components/shared/LeftSideAuth";
import type { ReactNode } from "react";



type AuthLayoutProps = {
    children: ReactNode;
    title: string;
    description: string;
};

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <main className="min-h-screen bg-background]">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                <LeftSideAuth />

                <section className="flex items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-1 flex justify-center lg:hidden">
                            <AppLogo />
                        </div>

                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                                {title}
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">{description}</p>
                        </div>

                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}