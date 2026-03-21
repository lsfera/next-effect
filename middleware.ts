import { getUser } from "@/lib/get-user";
import { NextRequest, NextResponse } from "next/server";

const guestOnlyPaths = ["/signin"];
const adminOnlyPaths = ["/submit/edit-success"];
const protectedPaths = ["/submit", "/dashboard"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isOnGuestPath = guestOnlyPaths.some(
        (route) => path === route || path.startsWith(`${route}/`),
    );
    const isOnAdminPath = adminOnlyPaths.some(
        (route) => path === route || path.startsWith(`${route}/`),
    );

    const isOnProtectedPath = protectedPaths.some(
        (route) => path === route || path.startsWith(`${route}/`),
    );

    const user = await getUser(request.headers);

    if (isOnAdminPath) {
        if (!user) {
            const redirectUrl = new URL("/signin", request.url);
            redirectUrl.searchParams.set("next", path);
            return NextResponse.redirect(redirectUrl);
        }
        if (user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    if (isOnProtectedPath && !user) {
        const redirectUrl = new URL("/signin", request.url);
        redirectUrl.searchParams.set("next", path);
        return NextResponse.redirect(redirectUrl);
    }

    if (isOnGuestPath && user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};