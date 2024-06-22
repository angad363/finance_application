import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { Loader2 } from "lucide-react";
import { WelcomeMessage } from "./welcome-message";

export const Header = () => {
    return (
        <div className="bg-gradient-to-b from-blue-700 to-blue-400 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mv-14">
                    <div className="flex items-center lg:gap-x-16 pb-5">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl="/" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400" />
                    </ClerkLoading>
                </div>
                <WelcomeMessage />
            </div>
        </div>
    );
}