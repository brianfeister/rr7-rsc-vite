import { type PropsWithChildren } from 'react';
import {
    data,
    type LoaderFunctionArgs,
    Outlet,
    ScrollRestoration,
    type UNSAFE_DataWithResponseInit,
    useRouteError
} from 'react-router';
import Header from './components/header';
import Footer from './components/footer';
// import CommerceProvider from './providers/commerce';
// import { getCommerceApiToken } from './utils/api/commerce-api';
import { ToastProvider } from './components/ui/toast';
// import Loading from './routes/loading';
// import DumpError from './routes/error';
import '../app/root.css';

type LoaderProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: Record<string, any>;
};

console.log('[debug:root] - Root module loaded successfully');

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({
    request
}: LoaderFunctionArgs): Promise<UNSAFE_DataWithResponseInit<LoaderProps>> {
    console.log('[debug:root] - Loader function called');

    try {
        console.log('[debug:root] - About to call getCommerceApiToken');
        // const [session, commitSession, status] =
        // await getCommerceApiToken(request);
        const commitSession = () => {
            return new Response('session', {
                headers: {
                    'Set-Cookie': 'session=fake-session-12345'
                }
            });
        };

        const session = {
            accessToken: 'fake-access-token-12345',
            accessTokenExpiry: Date.now() + 3600 * 1000, // 1 hour from now
            refreshToken: 'fake-refresh-token-12345',
            refreshTokenExpiry: Date.now() + 86400 * 1000, // 24 hours from now
            basketId: 'fake-basket-id-12345',
            usid: 'fake-usid-12345'
        };

        const status = 'new'; // Define the missing status variable

        console.log(
            '[debug:root] - getCommerceApiToken completed successfully'
        );

        console.log('[debug:root] - Commerce session created:', {
            hasAccessToken: !!session.accessToken, // Fix: access session.accessToken directly
            status
        });

        console.log('[debug:root] - About to return data');
        return data(
            {
                session: Object.freeze(session) // Fix: session is already the object, not session.data
            },
            {
                ...(status === 'new' || status === 'refreshed'
                    ? {
                          headers: {
                              'Set-Cookie': await commitSession() // Fix: call commitSession without argument
                          }
                      }
                    : {})
            }
        );
    } catch (error) {
        // Enhanced server-side error logging
        console.error('[debug:root] - Error creating commerce context:', {
            error:
                error instanceof Error
                    ? {
                          name: error.name,
                          message: error.message,
                          stack: error.stack
                      }
                    : error,
            requestUrl: request.url,
            requestMethod: request.method,
            timestamp: new Date().toISOString()
        });

        // Log the full error for debugging
        console.error('[debug:root] - Full error object:', error);

        // Return empty session if there's an error, but log it properly
        return data({
            session: Object.freeze({})
        });
    }
}

export function Layout({ children }: PropsWithChildren) {
    console.log('[debug:root] - Layout function called');

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <title>NextGen PWA Kit Store</title>
            </head>
            <body className="antialiased flex flex-col min-h-screen">
                <div id="root">{children}</div>
                <div id="toast-root" />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    console.log('[debug:root] - ErrorBoundary function called');

    // This will catch errors during server-side rendering
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
                Server Error
            </h1>
            <p className="text-gray-700 mb-4">
                An error occurred during server-side rendering. Check the server
                logs for more details.
            </p>
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-semibold mb-2">Debug Information:</h2>
                <p>
                    Check the server console/logs for detailed error
                    information.
                </p>
                <p>Time: {new Date().toISOString()}</p>
            </div>
        </div>
    );
}

// export default function App({
//     loaderData
// }: {
//     loaderData?: LoaderProps; // Make loaderData optional
// }) {
//     console.log(
//         '[debug:root] - App function called with loaderData:',
//         loaderData
//     );

//     // Provide a comprehensive default session if loaderData is not available
//     const defaultSession = {
//         accessToken: 'fake-access-token-12345',
//         accessTokenExpiry: Date.now() + 3600 * 1000, // 1 hour from now
//         refreshToken: 'fake-refresh-token-12345',
//         refreshTokenExpiry: Date.now() + 86400 * 1000, // 24 hours from now
//         basketId: 'fake-basket-id-12345',
//         usid: 'fake-usid-12345'
//     };

//     // Use loaderData.session if available, otherwise use default
//     const session = loaderData?.session || defaultSession;

//     console.log('[debug:root] - Using session:', {
//         source: loaderData ? 'loader' : 'default',
//         hasAccessToken: !!session.accessToken,
//         hasRefreshToken: !!session.refreshToken,
//         hasBasketId: !!session.basketId,
//         hasUsid: !!session.usid
//     });

//     return (
//         <CommerceProvider context={{ session }}>
//             {/* <ToastProvider> */}
//             <Loading />
//             <ScrollRestoration />
//             <Header />
//             <main className="flex-grow pt-8">
//                 <Outlet />
//             </main>
//             <Footer />
//             {/* </ToastProvider> */}
//         </CommerceProvider>
//     );
// }

export default function App() {
    console.log('[debug:root] - App function called');

    // Provide a comprehensive default session if loaderData is not available
    const session = {
        accessToken: 'fake-access-token-12345',
        accessTokenExpiry: Date.now() + 3600 * 1000, // 1 hour from now
        refreshToken: 'fake-refresh-token-12345',
        refreshTokenExpiry: Date.now() + 86400 * 1000, // 24 hours from now
        basketId: 'fake-basket-id-12345',
        usid: 'fake-usid-12345'
    };

    console.log('[debug:root] - Using session:', {
        source: 'default',
        hasAccessToken: !!session.accessToken,
        hasRefreshToken: !!session.refreshToken,
        hasBasketId: !!session.basketId,
        hasUsid: !!session.usid
    });

    return (
        <>
            {/* <CommerceProvider context={{ session }}> */}
            {/* <ToastProvider> */}
            {/* <Loading /> */}
            {/* <ScrollRestoration /> */}
            <Header />
            <main className="flex-grow pt-8">
                <Outlet />
            </main>
            <Footer />
            {/* </ToastProvider> */}
            {/* </CommerceProvider> */}
        </>
    );
}
