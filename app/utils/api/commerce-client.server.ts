import 'server-only';
import type {
    ShopperProductsTypes,
    ShopperSearchTypes
} from 'commerce-sdk-isomorphic';
import type { SessionData } from './commerce-api';
import {
    createShopperProductsClient,
    createShopperSearchClient
} from './commerce-client';

export const fetchProductsGetCategory = (
    session: SessionData,
    parameters: {
        id: string | null;
        levels?: number;
    }
): Promise<ShopperProductsTypes.Category> =>
    createShopperProductsClient(session).getCategory({
        parameters: {
            ...parameters,
            id: parameters.id ?? ''
        }
    });

export const fetchProductsGetProduct = (
    session: SessionData,
    parameters: {
        id: string | null;
        expand?: string[];
        allImages?: boolean;
        perPricebook?: boolean;
    }
): Promise<ShopperProductsTypes.Product> =>
    createShopperProductsClient(session).getProduct({
        parameters: {
            ...parameters,
            id: parameters.id ?? ''
        }
    });

export const fetchSearchProducts = (
    session: SessionData,
    parameters: {
        categoryId?: string;
        q?: string;
        filters?: Record<string, string[]>;
        sort?: string;
        limit?: number;
        page?: number;
        expand?: string[];
        refine?: string[];
        select?: string;
        currency?: string;
        allImages?: boolean;
        allVariationProperties?: boolean;
        perPricebook?: boolean;
    }
): Promise<ShopperSearchTypes.ProductSearchResult> => {
    const {
        categoryId,
        q = '',
        filters,
        sort = 'best-matches',
        limit = 24,
        page = 0,
        expand = [
            'promotions',
            'variations',
            'prices',
            'images',
            'page_meta_tags',
            'custom_properties'
        ],
        refine = [],
        currency = 'USD',
        allImages = true,
        allVariationProperties = true,
        perPricebook = true
    } = parameters || {};

    // Build refinements for product search
    const refineSet = new Set<string>(refine);
    if (categoryId) {
        refineSet.add(`cgid=${categoryId}`);
    }
    if (filters) {
        Object.entries(filters).forEach(([key, values]) => {
            values.forEach((value) => {
                refineSet.add(`${key}=${value}`);
            });
        });
    }

    // return createShopperSearchClient(session).productSearch({
    //     parameters: {
    //         q,
    //         sort,
    //         limit,
    //         expand,
    //         refine: [...refineSet],
    //         offset: page * limit,
    //         currency,
    //         allImages,
    //         allVariationProperties,
    //         perPricebook
    //     }
    // }) as unknown as Promise<ShopperSearchTypes.ProductSearchResult>;
};
