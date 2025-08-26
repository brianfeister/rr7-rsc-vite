import { useState, useCallback, useEffect, useTransition } from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';

interface WishlistItem {
    productId: string;
    product: ShopperSearchTypes.ProductSearchHit;
    variant?: ShopperSearchTypes.ProductSearchHit;
}

/**
 * A hook for managing a customer's wish list with React 19 patterns.
 * Uses useTransition for better UX during state updates.
 */
export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isPending, startTransition] = useTransition();

    // Load wishlist from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedWishlist = window.localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch {
                    // Silently handle localStorage errors
                }
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    const isItemInWishlist = useCallback(
        (
            product: ShopperSearchTypes.ProductSearchHit,
            variant?: ShopperSearchTypes.ProductSearchHit
        ) => {
            if (!wishlist || !product) {
                return false;
            }
            const productId = normalizeProductId(product, variant);
            return !!wishlist.find((item) => item.productId === productId);
        },
        [wishlist]
    );

    const addToWishlist = useCallback(
        async (
            product: ShopperSearchTypes.ProductSearchHit,
            variant?: ShopperSearchTypes.ProductSearchHit
        ) => {
            if (isItemInWishlist(product, variant)) {
                // Item is already in wishlist
                return;
            }

            const productId = normalizeProductId(product, variant);
            const newItem: WishlistItem = {
                productId,
                product,
                variant
            };

            startTransition(() => {
                setWishlist(prev => [...prev, newItem]);
            });
        },
        [isItemInWishlist, startTransition]
    );

    const removeFromWishlist = useCallback(
        async (product: ShopperSearchTypes.ProductSearchHit, variant?: ShopperSearchTypes.ProductSearchHit) => {
            const productId = normalizeProductId(product, variant);
            
            startTransition(() => {
                setWishlist(prev => prev.filter(item => item.productId !== productId));
            });
        },
        [startTransition]
    );

    const toggleWishlist = useCallback(
        async (
            product: ShopperSearchTypes.ProductSearchHit,
            variant?: ShopperSearchTypes.ProductSearchHit
        ) => {
            if (isItemInWishlist(product, variant)) {
                await removeFromWishlist(product, variant);
            } else {
                await addToWishlist(product, variant);
            }
        },
        [isItemInWishlist, addToWishlist, removeFromWishlist]
    );

    return {
        wishlist,
        isLoading: isPending,
        isItemInWishlist,
        toggleWishlist
    };
};

// Utility function to normalize product ID
const normalizeProductId = (
    product: ShopperSearchTypes.ProductSearchHit,
    variant?: ShopperSearchTypes.ProductSearchHit
) => {
    return variant?.productId || product?.productId || product?.id;
};
