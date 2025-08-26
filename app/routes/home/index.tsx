import type { ReactElement } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import Hero from '../../components/hero';
import ProductCarousel from '../../components/product-carousel';
import Features from './features';
import Help from './help';

// OAuth constants from environment variables
const shortCode = import.meta.env.VITE_SHORT_CODE || '8o7m175y';
const clientId = import.meta.env.VITE_CLIENT_ID || '';
const clientSecret = import.meta.env.VITE_CLIENT_SECRET || '';
const orgId = import.meta.env.VITE_ORG_ID || 'f_ecom_zzrf_001';
const siteId = import.meta.env.VITE_SITE_ID || 'RefArchGlobal';

// Replace nanoid with a custom implementation
const generateRandomString = (length = 21): string => {
    const alphabet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';

    for (let i = 0; i < length; i++) {
        // Use crypto.getRandomValues for secure random number generation
        const randomIndex =
            crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length;
        result += alphabet[randomIndex];
    }

    return result;
};

const createCodeVerifier = (): string => generateRandomString();

const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
    const urlSafe = (input: string) =>
        input.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Use Web Crypto API for SHA-256 hashing instead of Node.js crypto.createHash
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashBase64 = btoa(String.fromCharCode(...hashArray));

    const challenge = urlSafe(hashBase64);
    return challenge;
};

const getCommerceApiToken = async (request: Request) => {
    try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('channel_id', siteId);
        formData.append('dnt', 'true');

        const tokenResponse = await fetch(
            `https://pwa-kit.mobify-storefront.com/mobify/slas/private/shopper/auth/v1/organizations/${orgId}/oauth2/token`,
            {
                method: 'POST',
                body: formData.toString(), // This is equivalent to --data-raw
                headers: {
                    authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );
        const body = await tokenResponse.text();
        const bodyJson = JSON.parse(body);
        return bodyJson;
    } catch (error) {
        console.error('~~~~~~~~~ Error in getCommerceApiToken:', error);
        return error;
    }
};

const fetchProducts = async (token: string) => {
    try {
        // step 3. get data
        console.log('step 3: fetching data');
        const productResponse = await fetch(
            `https://${shortCode}.api.commercecloud.salesforce.com/search/shopper-search/v1/organizations/${orgId}/product-search?siteId=${siteId}&q=&refine=cgid%3Droot&sort=&currency=USD&locale=en-US&expand=custom_properties%2Cimages%2Cprices%2Cpromotions%2Cvariations&offset=0&limit=12`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const productData = await productResponse.json();

        return { productData: productData };
    } catch (error) {
        console.error('~~~~~~~~~ Error in fetchProducts:', error);
        // Return mock data on error
        return {
            hits: [
                {
                    productId: 'mock-error-1',
                    name: 'Mock Product (Error Fallback)'
                }
            ]
        };
    }
};

// This will be called on the server side
export async function loader({ request }: LoaderFunctionArgs) {
    console.log('~~~~~~~~~ loader called ~~~~~~~~~');
    const url = new URL(request.url);

    try {
        const auth = await getCommerceApiToken(request);

        const products = await fetchProducts(auth.access_token);
        return {
            productData: products?.productData ?? []
        };
    } catch (error) {
        console.error('~~~~~~~~~ Error in loader:', error);
    }
}

export default function Home({ loaderData }: { loaderData: any }) {
    // In React Router 7, loaderData is passed as a prop
    const { productData } = loaderData;
    const products = productData?.hits ?? [];

    return (
        <>
            <Hero
                title="The React Starter Store for High Performers"
                subtitle="Discover our latest collection of products"
                imageUrl="/images/hero.png"
                imageAlt="Hero banner showing products for high performers"
                ctaText="Shop Now"
                ctaLink="/category/root"
            />

            {/* Featured Products */}
            <div className="py-16">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductCarousel
                        title="Shop Products"
                        products={products}
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16">
                <Features />
            </div>

            {/* Help Section */}
            <div className="py-16">
                <Help />
            </div>
        </>
    );
}
