'use client';

import * as React from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import { cn } from '../../lib/utils';
import { PRODUCT_BADGE_DETAILS, getBadgeColorClass, type BadgeDetail } from '../../config/badges';
import { badgeVariants, productBadgesVariants, type ProductBadgesVariantsProps } from './badge-variants';

interface ProductBadgesProps extends React.ComponentProps<'div'>, ProductBadgesVariantsProps {
    product: ShopperSearchTypes.ProductSearchHit;
    badgeDetails?: BadgeDetail[];
    maxBadges?: number;
    'aria-label'?: string;
}

const ProductBadges = React.forwardRef<HTMLDivElement, ProductBadgesProps>(
    ({ 
        className, 
        product, 
        badgeDetails = PRODUCT_BADGE_DETAILS, 
        maxBadges = 3, 
        variant,
        size,
        'aria-label': ariaLabel,
        ...props 
    }, ref) => {
        // Helper function to check if a property should show a badge
        const shouldShowBadge = React.useCallback((value: unknown): boolean => {
            if (typeof value === 'boolean') return value;
            if (typeof value === 'string') {
                return value === 'true' || value === '1' || value.toLowerCase() === 'yes';
            }
            if (typeof value === 'number') return value === 1;
            return false;
        }, []);

        const badges = React.useMemo(() => {
            if (!product) return [];

            const activeBadges: BadgeDetail[] = [];

            // Check representedProduct properties (where c_isSale is located)
            if (product.representedProduct) {
                badgeDetails.forEach((badge) => {
                    const propertyValue = (product.representedProduct as Record<string, unknown>)[badge.propertyName];
                    if (shouldShowBadge(propertyValue)) {
                        activeBadges.push(badge);
                    }
                });
            }

            // Check custom properties as fallback
            if (product.customProperties && Array.isArray(product.customProperties)) {
                badgeDetails.forEach((badge) => {
                    // Skip if badge already found in representedProduct
                    if (activeBadges.find(b => b.propertyName === badge.propertyName)) {
                        return;
                    }

                    const customProp = product.customProperties?.find((prop: { id?: string; value?: unknown }) => 
                        prop.id === badge.propertyName || 
                        prop.id?.toLowerCase() === badge.propertyName.toLowerCase()
                    );

                    if (customProp && shouldShowBadge(customProp.value)) {
                        activeBadges.push(badge);
                    }
                });
            }

            // Check promotions for sale badge (if not already found)
            if (product.promotions && product.promotions.length > 0) {
                const saleBadge = badgeDetails.find(badge => badge.propertyName === 'c_isSale');
                if (saleBadge && !activeBadges.find(badge => badge.propertyName === 'c_isSale')) {
                    activeBadges.push(saleBadge);
                }
            }

            // Check if product is out of stock
            if (product.inStock === false) {
                const outOfStockBadge = badgeDetails.find(badge => badge.propertyName === 'c_isOutOfStock');
                if (outOfStockBadge && !activeBadges.find(badge => badge.propertyName === 'c_isOutOfStock')) {
                    activeBadges.push(outOfStockBadge);
                }
            }

            // Sort by priority (higher priority first)
            return activeBadges
                .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                .slice(0, maxBadges);
        }, [product, badgeDetails, maxBadges, shouldShowBadge]);

        if (badges.length === 0) {
            return null;
        }

        const defaultAriaLabel = `Product badges: ${badges.map(b => b.label).join(', ')}`;

        return (
            <div
                ref={ref}
                className={cn(productBadgesVariants({ variant, size }), className)}
                aria-label={ariaLabel || defaultAriaLabel}
                role="group"
                {...props}
            >
                {badges.map((badge) => (
                    <div
                        key={badge.propertyName}
                        className={cn(
                            badgeVariants({ variant: 'solid', size }),
                            getBadgeColorClass(badge.color)
                        )}
                        role="status"
                        aria-label={`${badge.label} product`}
                    >
                        {badge.label}
                    </div>
                ))}
            </div>
        );
    }
);
ProductBadges.displayName = 'ProductBadges';

export { ProductBadges };
