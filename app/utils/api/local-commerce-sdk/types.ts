// Core types for the local commerce SDK

export interface BaseUriParameters {
    shortCode: string;
    organizationId: string;
    version?: string;
}

export interface CustomQueryParameters {
    [key: string]: string | number | boolean | undefined;
}

export interface CustomRequestBody {
    [key: string]: any;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    usid: string;
    customer_id?: string;
    enc_user_id?: string;
}

export interface ShopperLoginConfig {
    shortCode: string;
    organizationId: string;
    clientId: string;
    siteId: string;
    version?: string;
    baseUri?: string;
    proxy?: string;
    headers?: Record<string, string>;
    fetchOptions?: RequestInit;
}

export interface ShopperLoginPathParameters {
    organizationId: string;
    shortCode: string;
}

export interface authorizeCustomerQueryParameters {
    client_id: string;
    channel_id: string;
    code_challenge?: string;
    hint?: string;
    redirect_uri: string;
    response_type: string;
    usid?: string;
    [key: string]: any;
}

export interface getAccessTokenQueryParameters {
    [key: string]: any;
}

export interface getAccessTokenRequestBody {
    grant_type: string;
    client_id: string;
    channel_id: string;
    code?: string;
    code_verifier?: string;
    redirect_uri?: string;
    usid?: string;
    dnt?: string;
    refresh_token?: string;
    [key: string]: any;
}
