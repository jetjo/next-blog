import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

let locales = ["en-US", "zh-CN", "zh"];
let defaultLocale = "en-US";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: any) {
  // const headers = new Headers(request.headers);
  const languages = new Negotiator(request)
    .languages()
    .filter((l) => l !== "*");
  console.log(languages, "languages");

  return match(languages, locales, defaultLocale); // -> 'en-US'
}

export default function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

middleware.matcher = ["/((?!_next).*)",]