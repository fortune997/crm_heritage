import Image from "next/image";

type AppLogoProps = {
    className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={className}>
            <Image
                src="/images/heritage-logo.jpg"
                alt="Heritage Logo"
                width={120}
                height={220}
                priority
                className="h-auto w-[170px] object-contain"
            />
        </div>
    );
}