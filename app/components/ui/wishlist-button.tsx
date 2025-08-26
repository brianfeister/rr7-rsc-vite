'use client';

import * as React from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import { HeartIcon } from './heart-icon';
import { useWishlist } from '../../hooks/use-wishlist';

interface WishlistButtonProps {
    product: ShopperSearchTypes.ProductSearchHit;
    variant?: ShopperSearchTypes.ProductSearchHit;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
    product,
    variant,
    size = 'md',
    className
}) => {
    const { isItemInWishlist, toggleWishlist, isLoading } = useWishlist();
    const isInWishlist = isItemInWishlist(product, variant);

    const handleWishlistToggle = React.useCallback(async () => {
        await toggleWishlist(product, variant);
    }, [product, variant, toggleWishlist]);

    return (
        <HeartIcon
            isFilled={isInWishlist}
            disabled={isLoading}
            onClick={handleWishlistToggle}
            size={size}
            className={className}
        />
    );
};

export { WishlistButton };
