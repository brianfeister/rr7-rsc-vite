'use client';

import { lazy, type ReactElement, Suspense, useEffect, useState } from 'react';
import { type LoaderFunctionArgs, useFetcher } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import type { ShopperBasketsTypes } from 'commerce-sdk-isomorphic';
import { Button } from '../ui/button';
import { useCartStore } from '../../providers/cart-store';
import CartBadgeIcon from './cart-badge-icon';

const CartSheet = lazy(() => import('./cart-sheet'));

/**
 * The trigger is a client component that uses a react-router fetcher to load the desired cart data
 * via a Server Function call. Right now the component defers the loading of the mini cart sheet
 * until the first user interaction with the cart icon. The loading of the sheet component itself
 * could in theory also happen earlier, e.g. right after the initial load on the client. Subject
 * for experiments...
 * @see {@link https://react.dev/reference/rsc/server-functions}
 * @see {@link https://reactrouter.com/api/hooks/useFetcher}
 */
export default function CartBadgeTrigger(): ReactElement {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);

    const fetcher =
        useFetcher<
            (args: LoaderFunctionArgs) => Promise<ShopperBasketsTypes.Basket>
        >();
    const { updateCart } = useCartStore(
        useShallow((state) => ({
            updateCart: state.updateCart
        }))
    );

    useEffect(() => {
        if (!loaded) {
            // Load cart data on initial badge display
            setLoaded(true);
            fetcher.load('/cart');
        }
    }, [loaded, fetcher]);

    useEffect(() => {
        // Update cart store with fetched data
        // TODO: Need to assess data invalidation/retention strategies on top of using fetchers
        if (fetcher.data) {
            updateCart(fetcher.data);
        }
    }, [fetcher.data, updateCart]);

    if (clicked) {
        return (
            <Suspense
                fallback={
                    <Button variant="ghost" className="pointer-events-none">
                        <CartBadgeIcon />
                    </Button>
                }
            >
                <CartSheet>
                    <Button variant="ghost" className="cursor-pointer">
                        <CartBadgeIcon />
                    </Button>
                </CartSheet>
            </Suspense>
        );
    }

    return (
        <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => setClicked(true)}
        >
            <CartBadgeIcon />
        </Button>
    );
}
