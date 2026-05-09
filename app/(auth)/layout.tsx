import { AppLogo } from "@/components/shared/AppLogo";
import LeftSideAuth from "@/components/shared/LeftSideAuth";
import type { ReactNode } from "react";



type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background]">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                <LeftSideAuth />

                <section className="flex items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-1 flex justify-center lg:hidden">
                            <AppLogo />
                        </div>


                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}