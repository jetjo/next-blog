import { NextRequest } from 'next/server'
// import { isAuthenticated } from '@lib/auth'

function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    // if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return Response.json(
        { success: false, message: 'authentication failed' },
        { status: 401 }
    )
    // }
}

// Limit the middleware to paths starting with `/api/`
middleware.matcher = ['/api/:function*']

export default middleware;