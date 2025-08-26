// Helper functions for the local commerce SDK

import type {
    ShopperLoginConfig,
    CustomQueryParameters,
    TokenResponse
} from './types';
import { ShopperLogin } from './shopper-login';
import {
    createCodeVerifier,
    generateCodeChallenge,
    getCodeAndUsidFromUrl
} from './utils';

/**
 * Wrapper for the authorization endpoint. For guest login, returns the code and usid directly.
 */
async function authorize(options: {
    slasClient: ShopperLogin<ShopperLoginConfig>;
    codeVerifier: string;
    parameters: {
        redirectURI: string;
        hint?: string;
        usid?: string;
    } & CustomQueryParameters;
    privateClient?: boolean;
}): Promise<{ code: string; url: string; usid: string }> {
    const {
        slasClient,
        codeVerifier,
        parameters,
        privateClient = false
    } = options;

    interface ClientOptions {
        codeChallenge?: string;
    }
    const clientOptions: ClientOptions = {};

    if (!privateClient) {
        clientOptions.codeChallenge = await generateCodeChallenge(codeVerifier);
    }

    // Create a copy to override specific fetchOptions
    const slasClientCopy = new ShopperLogin(slasClient.clientConfig);

    // Set manual redirect on server since Cloudflare Workers allows access to the location header
    slasClientCopy.clientConfig.fetchOptions = {
        ...slasClient.clientConfig.fetchOptions,
        redirect: 'manual'
    };

    const { hint, redirectURI, usid, ...restOfParams } = parameters;
    const opts = {
        parameters: {
            ...restOfParams,
            client_id: slasClient.clientConfig.clientId,
            channel_id: slasClient.clientConfig.siteId,
            ...(clientOptions.codeChallenge && {
                code_challenge: clientOptions.codeChallenge
            }),
            ...(hint && { hint }),
            organizationId: slasClient.clientConfig.organizationId,
            redirect_uri: redirectURI,
            response_type: 'code' as const,
            ...(usid && { usid })
        }
    };

    const response = await slasClientCopy.authorizeCustomer(opts, true);

    if (response instanceof Response) {
        const redirectUrlString =
            response.headers?.get('location') || response.url;
        if (!redirectUrlString) {
            throw new Error('No redirect location found in response');
        }

        const redirectUrl = new URL(redirectUrlString);
        const searchParams = Object.fromEntries(
            redirectUrl.searchParams.entries()
        );

        if (response.status >= 400 || searchParams.error) {
            throw new Error(
                `Authorization failed: ${response.status} ${response.statusText}`
            );
        }

        return {
            url: redirectUrlString,
            ...getCodeAndUsidFromUrl(redirectUrlString)
        };
    }

    return response;
}

/**
 * A single function to execute the ShopperLogin Public Client Guest Login with proof key for code exchange flow.
 * This is the main function you need for the home page.
 */
export async function loginGuestUser(options: {
    slasClient: ShopperLogin<ShopperLoginConfig>;
    parameters: {
        redirectURI: string;
        usid?: string;
        dnt?: boolean;
    } & CustomQueryParameters;
}): Promise<TokenResponse> {
    const { slasClient, parameters } = options;
    const codeVerifier = createCodeVerifier();

    const { dnt, redirectURI, usid, ...restOfParams } = parameters;
    const authResponse = await authorize({
        slasClient,
        codeVerifier,
        parameters: {
            ...restOfParams,
            redirectURI,
            hint: 'guest',
            ...(usid && { usid })
        },
        privateClient: false
    });

    const tokenBody = {
        client_id: slasClient.clientConfig.clientId,
        channel_id: slasClient.clientConfig.siteId,
        code: authResponse.code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code_pkce' as const,
        redirect_uri: redirectURI,
        usid: authResponse.usid,
        ...(dnt !== undefined && { dnt: dnt.toString() })
    };

    return slasClient.getAccessToken({ body: tokenBody });
}

/**
 * A single function to execute the ShopperLogin Private Client Guest Login.
 * Use this when you have a client secret.
 */
export async function loginGuestUserPrivate(options: {
    slasClient: ShopperLogin<ShopperLoginConfig>;
    parameters: {
        usid?: string;
        dnt?: boolean;
    };
    credentials: {
        clientSecret: string;
    };
}): Promise<TokenResponse> {
    const { slasClient, parameters, credentials } = options;

    if (!slasClient.clientConfig.siteId) {
        throw new Error(
            'Required argument channel_id is not provided through clientConfig.siteId'
        );
    }

    const authorization = `Basic ${btoa(
        `${slasClient.clientConfig.clientId}:${credentials.clientSecret}`
    )}`;

    const opts = {
        headers: {
            Authorization: authorization
        },
        body: {
            grant_type: 'client_credentials' as const,
            channel_id: slasClient.clientConfig.siteId,
            ...(parameters.usid && { usid: parameters.usid }),
            ...(parameters.dnt !== undefined && {
                dnt: parameters.dnt.toString()
            })
        }
    };

    return slasClient.getAccessToken(opts);
}

/**
 * Exchange a refresh token for a new access token.
 */
export function refreshAccessToken(options: {
    slasClient: ShopperLogin<ShopperLoginConfig>;
    parameters: {
        refreshToken: string;
        dnt?: boolean;
    };
    credentials?: { clientSecret?: string };
}): Promise<TokenResponse> {
    const { slasClient, parameters, credentials } = options;
    const body = {
        grant_type: 'refresh_token' as const,
        refresh_token: parameters.refreshToken,
        client_id: slasClient.clientConfig.clientId,
        channel_id: slasClient.clientConfig.siteId,
        ...(parameters.dnt !== undefined && { dnt: parameters.dnt.toString() })
    };

    if (credentials && credentials.clientSecret) {
        const authorization = `Basic ${btoa(
            `${slasClient.clientConfig.clientId}:${credentials.clientSecret}`
        )}`;
        const opts = {
            headers: {
                Authorization: authorization
            },
            body
        };
        return slasClient.getAccessToken(opts);
    }

    return slasClient.getAccessToken({ body });
}

/**
 * Logout a shopper.
 */
export function logout(options: {
    slasClient: ShopperLogin<ShopperLoginConfig>;
    parameters: {
        accessToken: string;
        refreshToken: string;
    };
}): Promise<TokenResponse> {
    const { slasClient, parameters } = options;
    return slasClient.logoutCustomer({
        headers: {
            Authorization: `Bearer ${parameters.accessToken}`
        },
        parameters: {
            refresh_token: parameters.refreshToken,
            client_id: slasClient.clientConfig.clientId,
            channel_id: slasClient.clientConfig.siteId
        }
    });
}
