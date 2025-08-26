// Utility functions for the local commerce SDK

// Simple nanoid implementation for Cloudflare Workers
export function nanoid(size: number = 21): string {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Base64 encoding for Cloudflare Workers
export function stringToBase64(str: string): string {
    if (typeof btoa !== 'undefined') {
        return btoa(str);
    }
    // Fallback for environments without btoa
    return Buffer ? Buffer.from(str).toString('base64') : str;
}

// Generate code challenge from code verifier
export async function generateCodeChallenge(
    codeVerifier: string
): Promise<string> {
    const urlSafe = (input: string) =>
        input.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const base64Digest = btoa(
            String.fromCharCode(...new Uint8Array(digest))
        );
        return urlSafe(base64Digest);
    } else {
        // Fallback for environments without crypto.subtle
        throw new Error('Crypto API not available');
    }
}

// Create code verifier
export function createCodeVerifier(): string {
    return nanoid(128);
}

// Parse code and usid from URL
export function getCodeAndUsidFromUrl(urlString: string): {
    code: string;
    usid: string;
} {
    const url = new URL(urlString);
    const urlParams = new URLSearchParams(url.search);
    const usid = urlParams.get('usid') ?? '';
    const code = urlParams.get('code') ?? '';

    return { code, usid };
}

// Check if running in browser
export const isBrowser =
    typeof window !== 'undefined' && typeof document !== 'undefined';
