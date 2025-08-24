'use client';

import * as React from 'react';
import { Link } from 'react-router';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import { ProductBadges } from '../productCard/badges';
import { WishlistButton } from './wishlist-button';
import { Button } from './button';

interface ProductImageContainerProps {
    product: ShopperSearchTypes.ProductSearchHit;
    selectedColorValue?: string | null;
    className?: string;
}

const ProductImageContainer: React.FC<ProductImageContainerProps> = ({ 
    product, 
    selectedColorValue = null,
    className 
}) => {
    // Get the product image for the selected color variant
    const getProductImageForColor = React.useCallback((colorValue: string | null) => {
        if (!colorValue || !product.imageGroups) return product.image?.disBaseLink ?? product.image?.link;
        
        // Look for the main product image for this color variant
        for (const imageGroup of product.imageGroups) {
            if (
                imageGroup.viewType === 'large' ||
                imageGroup.viewType === 'medium' ||
                !imageGroup.viewType
            ) {
                if (
                    imageGroup.variationAttributes &&
                    Array.isArray(imageGroup.variationAttributes)
                ) {
                    for (const attr of imageGroup.variationAttributes) {
                        if (
                            attr.id === 'color' &&
                            attr.values &&
                            Array.isArray(attr.values)
                        ) {
                            for (const value of attr.values) {
                                if (
                                    value.value === colorValue &&
                                    imageGroup.images &&
                                    imageGroup.images.length > 0
                                ) {
                                    return imageGroup.images[0].disBaseLink ?? imageGroup.images[0].link;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return product.image?.disBaseLink ?? product.image?.link;
    }, [product]);

    const currentImageUrl = getProductImageForColor(selectedColorValue);

    return (
        <div className={`relative aspect-square overflow-hidden rounded-lg bg-secondary/20 mb-4 border-secondary ${className || ''}`}>
            {/* Product Image */}
            <Link 
                to={`/product/${product.productId}`}
                className="block w-full h-full"
                aria-label={`View ${product.productName}`}
            >
                <img
                    src={`${currentImageUrl}?sw=300&q=60`}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
                    loading="lazy"
                />
            </Link>

            {/* Product Badges */}
            <ProductBadges product={product} maxBadges={3} />

            {/* Wishlist Button */}
            <WishlistButton product={product} size="md" />

            {/* Select Variant Button */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button asChild variant="secondary" className="w-full">
                    <Link 
                        to={`/product/${product.productId}`}
                        className="text-sm font-medium"
                    >
                        Select Variant
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export { ProductImageContainer };
