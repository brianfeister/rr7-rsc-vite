import type { ReactElement } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import CartTitle from './components/cart-title';
import CartItemsList from './components/cart-items-list';
import CartSummarySection from './components/cart-summary-section';
import EmptyCart from '../../components/cart/empty-cart';
import { getCommerceApiToken } from '../../utils/api/commerce-api';
import { fetchBasket, fetchProductsInBasket } from './actions';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';

/**
 * Data structure returned by cart loader functions
 * @typedef {Object} CartLoaderData
 * @property {ShopperBasketsTypes.Basket | undefined} basket - The user's shopping basket, undefined if no basket exists
 * @property {Record<string, ShopperProductsTypes.Product> | undefined} productsByItemId - Mapping of product details by
 *  basket item ID
 */
export type CartLoaderData = {
    basket: ShopperBasketsTypes.Basket | undefined;
    productsByItemId?: Record<string, ShopperProductsTypes.Product>;
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader(
    args: LoaderFunctionArgs
): Promise<CartLoaderData> {
    const [session] = await getCommerceApiToken(args.request);
    const { basketId } = session.data;

    if (!basketId) {
        return {
            basket: undefined,
            productsByItemId: undefined
        };
    }

    // Fetch basket
    const basket = await fetchBasket(basketId, session);

    // Fetch product details
    const productsByItemId = await fetchProductsInBasket(basket, session);

    return {
        basket,
        productsByItemId
    };
}

export default function Cart({
    loaderData: { basket, productsByItemId }
}: {
    loaderData: CartLoaderData;
}): ReactElement {
    // Check if cart is empty
    if (!basket?.productItems?.length) {
        return <EmptyCart isRegistered={false} />;
    }

    return (
        <div className="bg-muted flex-1" data-testid="sf-cart-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
                <div className="space-y-24">
                    <div className="space-y-4">
                        <CartTitle basket={basket} />

                        <div className="grid grid-cols-1 lg:grid-cols-[66%_1fr] gap-10 xl:gap-20">
                            <div>
                                <CartItemsList
                                    basket={basket}
                                    productsByItemId={productsByItemId}
                                />
                            </div>
                            <div>
                                <CartSummarySection
                                    basket={basket}
                                    isDesktop={true}
                                    productsByItemId={productsByItemId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile CTA */}
            <CartSummarySection
                basket={basket}
                isDesktop={false}
                productsByItemId={productsByItemId}
            />
        </div>
    );
}
