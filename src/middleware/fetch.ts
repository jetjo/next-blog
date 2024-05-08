import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export function withFetcher(fetcher: (req: NextRequest) => Promise<Response>) {
    fetcher ||= (req: NextRequest) => {
        return fetch('https://my-analytics-platform.com', {
            method: 'POST',
            body: JSON.stringify({ pathname: req.nextUrl.pathname }),
        })
    }
    return function middleware(req: NextRequest, event: NextFetchEvent) {
        event.waitUntil(fetcher(req))
        return NextResponse.next()
    }
}