import type { Session } from 'react-router';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import {
    createShopperBasketsClient,
    createShopperProductsClient
} from '../../utils/api/commerce-client';
import type { SessionData } from '../../utils/api/commerce-api';

/*
 * Fetches a shopping basket by its ID from the Commerce Cloud API
 *
 * @param {string} basketId - The unique identifier of the basket to retrieve
 * @param {Session<SessionData>} session - The authenticated session object containing API credentials
 * @returns {Promise<ShopperBasketsTypes.Basket>} Promise that resolves to the basket data
 * @throws {Error} When the basket cannot be retrieved or the API request fails
 */
export async function fetchBasket(
    basketId: string,
    session: Session<SessionData>
): Promise<ShopperBasketsTypes.Basket> {
    const basketsClient = createShopperBasketsClient(session.data);

    return await basketsClient.getBasket({
        parameters: {
            basketId
        }
    });
}

/*
 * Fetches detailed product information for all items in a shopping basket
 *
 * This function retrieves product details including images, pricing, and attributes
 * for each product in the basket. It creates a mapping from basket item IDs to
 * their corresponding product data for efficient lookup in the UI.
 *
 * @param {ShopperBasketsTypes.Basket} basket - The shopping basket containing product items
 * @param {Session<SessionData>} session - The authenticated session object containing API credentials
 * @returns {Promise<Record<string, ShopperProductsTypes.Product> | undefined>} Promise that resolves
 * to a mapping of item IDs to product data, or undefined if no items or error occurs
 */
export async function fetchProductsInBasket(
    basket: ShopperBasketsTypes.Basket,
    session: Session<SessionData>
): Promise<Record<string, ShopperProductsTypes.Product> | undefined> {
    if (!basket.productItems || basket.productItems.length === 0) {
        return undefined;
    }

    // Main product IDs from basket items
    const productIds = basket.productItems
        .map((item) => item.productId)
        .filter(Boolean)
        .join(',');

    if (!productIds) {
        return undefined;
    }

    const productsClient = createShopperProductsClient(session.data);

    try {
        const productsResponse = await productsClient.getProducts({
            parameters: {
                ids: productIds,
                allImages: true,
                perPricebook: true
            }
        });

        if (!productsResponse.data) {
            return undefined;
        }

        const products = productsResponse.data.reduce(
            (acc, product) => {
                acc[product.id] = product;
                return acc;
            },
            {} as Record<string, ShopperProductsTypes.Product>
        );

        // Create productsByItemId mapping
        const productsByItemId: Record<string, ShopperProductsTypes.Product> =
            {};
        basket.productItems.forEach((productItem) => {
            if (
                productItem?.productId &&
                productItem.itemId &&
                products[productItem.productId]
            ) {
                productsByItemId[productItem.itemId] =
                    products[productItem.productId];
            }
        });

        return productsByItemId;
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        return undefined;
    }
}
