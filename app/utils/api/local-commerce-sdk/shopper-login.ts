// ShopperLogin client for the local commerce SDK

import type {
    ShopperLoginConfig,
    ShopperLoginPathParameters,
    authorizeCustomerQueryParameters,
    getAccessTokenQueryParameters,
    getAccessTokenRequestBody,
    TokenResponse
} from './types';

export class ShopperLogin<T extends ShopperLoginConfig> {
    public clientConfig: T;

    // API paths
    // https://{shortCode}.api.commercecloud.salesforce.com/custom/{apiName}/{apiVersion}
    // slas/private/shopper/auth/v1/organizations/f_ecom_zzrf_001/oauth2/token
    static readonly apiPaths = {
        authorizeCustomer:
            '/shopper/auth/v1/organizations/{organizationId}/oauth2/authorize',
        getAccessToken:
            '/shopper/auth/v1/organizations/{organizationId}/oauth2/token',
        logoutCustomer:
            '/shopper/auth/v1/organizations/{organizationId}/oauth2/logout'
    };

    constructor(config: T) {
        this.clientConfig = config;
    }

    // Authorize customer (first step of OAuth flow)
    async authorizeCustomer(
        options: {
            parameters: authorizeCustomerQueryParameters;
            headers?: Record<string, string>;
        },
        returnResponse?: boolean
    ): Promise<Response | { code: string; url: string; usid: string }> {
        const { parameters, headers = {} } = options;

        // Build the URL
        const url = this.buildAuthorizeUrl(parameters);

        // Make the request
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this.clientConfig.headers,
                ...headers
            },
            ...this.clientConfig.fetchOptions
        });

        if (returnResponse) {
            return response;
        }

        // Parse the response
        if (response.status >= 400) {
            throw new Error(
                `Authorization failed: ${response.status} ${response.statusText}`
            );
        }

        // For guest login, the response should contain code and usid in the URL
        const location = response.headers.get('location') || response.url;
        if (!location) {
            throw new Error('No redirect location found in response');
        }

        // Parse the response URL to extract code and usid
        const urlObj = new URL(location);
        const code = urlObj.searchParams.get('code') || '';
        const usid = urlObj.searchParams.get('usid') || '';

        return { code, url: location, usid };
    }

    // Get access token (second step of OAuth flow)
    async getAccessToken(options: {
        body: getAccessTokenRequestBody;
        headers?: Record<string, string>;
        parameters?: getAccessTokenQueryParameters;
    }): Promise<TokenResponse> {
        const { body, headers = {}, parameters = {} } = options;

        // Build the URL
        const url = this.buildTokenUrl(parameters);

        // Make the request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...this.clientConfig.headers,
                ...headers
            },
            body: this.buildFormData(body),
            ...this.clientConfig.fetchOptions
        });

        if (!response.ok) {
            throw new Error(
                `Token request failed: ${response.status} ${response.statusText}`
            );
        }

        const tokenData = await response.json();
        return tokenData;
    }

    // Logout customer
    async logoutCustomer(options: {
        headers: Record<string, string>;
        parameters: {
            refresh_token: string;
            client_id: string;
            channel_id: string;
            redirect_uri: string;
        };
    }): Promise<TokenResponse> {
        const { headers, parameters } = options;

        // Build the URL
        const url = this.buildLogoutUrl();

        // Make the request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...this.clientConfig.headers,
                ...headers
            },
            body: this.buildFormData(parameters),
            ...this.clientConfig.fetchOptions
        });

        if (!response.ok) {
            throw new Error(
                `Logout failed: ${response.status} ${response.statusText}`
            );
        }

        const logoutData = await response.json();
        return logoutData;
    }

    // Private helper methods
    private buildAuthorizeUrl(
        parameters: authorizeCustomerQueryParameters
    ): string {
        const baseUrl = `http://localhost:5173/mobify/proxy/api`;
        const path = ShopperLogin.apiPaths.authorizeCustomer.replace(
            '{organizationId}',
            this.clientConfig.organizationId
        );

        const url = new URL(`${baseUrl}${path}`);

        // Add query parameters
        Object.entries(parameters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });

        return url.toString();
    }

    private buildTokenUrl(parameters: getAccessTokenQueryParameters): string {
        const baseUrl =
            this.clientConfig.proxy ||
            this.clientConfig.baseUri ||
            'https://api.commercecloud.salesforce.com';
        const path = ShopperLogin.apiPaths.getAccessToken.replace(
            '{organizationId}',
            this.clientConfig.organizationId
        );

        const url = new URL(path, baseUrl);

        // Add query parameters
        Object.entries(parameters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });

        return url.toString();
    }

    private buildLogoutUrl(): string {
        const baseUrl =
            this.clientConfig.proxy ||
            this.clientConfig.baseUri ||
            'https://api.commercecloud.salesforce.com';
        const path = ShopperLogin.apiPaths.logoutCustomer.replace(
            '{organizationId}',
            this.clientConfig.organizationId
        );

        return new URL(path, baseUrl).toString();
    }

    private buildFormData(data: Record<string, any>): string {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        return params.toString();
    }
}
