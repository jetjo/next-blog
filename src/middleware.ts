import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import i18n from "./middleware/i18n";

export function middleware(request: NextRequest) {
  return i18n(request);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
    // ,
    // 不能这样,必须字面量
    // ...i18n.matcher
  ],
};


// #region +++++++++++++++++ utils +++++++++++++++++
type NR = NextRequest

function reRequestMD(type: 'redirect' | 'rewrite') {
  const next = type === 'redirect' ? NextResponse.redirect : NextResponse.rewrite;
  return function (path: string, matcher?: RegExp) {
    return (req: NR) => {
      if (!matcher || matcher.test(req.nextUrl.pathname)) {
        return next(new URL(path, req.url))
      }
    }
  }
}

const redirectMiddlewareFactory = reRequestMD('redirect');
const rewriteMiddlewareFactory = reRequestMD('rewrite')

function requestCookies(req: NR) {
  return req.cookies;
}
function responseCookies<T>(res: NextResponse<T>) {
  return res.cookies;
}

function requestHead(req: NR) {
  return new Headers(req.headers)
}

function responseHead<T>(res: NextResponse<T>) {
  return res.headers;
}

function genResponse(req: NR, withReqHeaders = true) {
  const option = {} as Parameters<typeof NextResponse['next']>[0]
  if (withReqHeaders) option!.request = { headers: requestHead(req) }
  return NextResponse.next(option)
}
// #endregion
