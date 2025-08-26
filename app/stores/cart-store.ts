import { createStore } from 'zustand/vanilla';
import type { ShopperBasketsTypes } from 'commerce-sdk-isomorphic';

type CartStoreState = {
    cart?: ShopperBasketsTypes.Basket;
};

type CartStoreActions = {
    updateCart: (
         
        nextCart: CartStoreState['cart'] | ((currentCart: CartStoreState['cart']) => CartStoreState['cart'])
    ) => void;
};

export type CartStore = CartStoreState & CartStoreActions;

const defaultState: CartStoreState['cart'] = undefined;

/**
 * Creates a `zustand` store to hold information about the current cart object.
 * @see {@link https://zustand.docs.pmnd.rs/guides/nextjs}
 */
export const createCartStore = (initState: CartStoreState['cart'] = defaultState) => {
    return createStore<CartStore>()((set) => ({
        cart: initState ? { ...initState } : undefined,
        updateCart: (
             
            nextCart: CartStoreState['cart'] | ((currentCart: CartStoreState['cart']) => CartStoreState['cart'])
        ): void => {
            set((state: CartStore) => ({
                cart: typeof nextCart === 'function' ? nextCart(state.cart) : nextCart,
            }));
        },
    }));
};
