import { ShopperLogin } from './local-commerce-sdk';
import type { SessionData } from './commerce-api';

type CommerceClientConfig = {
    clientId: string;
    organizationId: string;
    shortCode: string;
    siteId: string;
    locale: string;
    currency: string;
    proxy: string;
    redirectURI: string;
};

export const getClientConfig = (): CommerceClientConfig => {
    // In Cloudflare Workers, environment variables are accessed differently
    // For now, use default values that should work
    const clientId = 'c9c45bfd-0ed3-4aa2-9971-40f88962b836';
    const organizationId = 'f_ecom_zzrf_001';
    // Use the short code that matches the working proxy configuration
    const shortCode = '8o7m175y';
    const siteId = 'RefArchGlobal';
    const locale = 'en-US';
    const currency = 'USD';

    const apiUrl = 'http://localhost:5173';
    const apiProxy = '/mobify/proxy/api';
    const apiCallback = '/callback';

    const proxy = `${apiUrl}${apiProxy}`;
    const redirectURI = `${apiUrl}${apiCallback}`;

    console.log('[debug:commerce-client] - Client config created:', {
        clientId,
        organizationId,
        shortCode,
        siteId,
        locale,
        currency,
        proxy,
        redirectURI
    });

    return {
        clientId,
        organizationId,
        shortCode,
        siteId,
        locale,
        currency,
        proxy,
        redirectURI
    };
};

function createClient(
    session: SessionData
): ShopperLogin<CommerceClientConfig> {
    const config = getClientConfig();

    console.log(
        '[debug:commerce-client] - Creating ShopperLogin client with config:',
        {
            shortCode: config.shortCode,
            organizationId: config.organizationId,
            clientId: config.clientId,
            siteId: config.siteId,
            hasAccessToken: !!session.accessToken
        }
    );

    return new ShopperLogin(config);
}

export const getSlasClient = (): ShopperLogin<CommerceClientConfig> => {
    return createClient({});
};

export const createShopperProductsClient = (session: SessionData) =>
    createClient(session);
export const createShopperBasketsClient = (session: SessionData) =>
    createClient(session);
export const createShopperSearchClient = (session: SessionData) =>
    createClient(session);
