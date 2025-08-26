'use client';

import * as React from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';

import { cn } from '../../lib/utils';
import {
    swatchVariants,
    productSwatchesVariants,
    type SwatchVariantsProps,
    type ProductSwatchesVariantsProps
} from './swatch-variants';

interface SwatchProps extends React.ComponentProps<'div'>, SwatchVariantsProps {
    imageUrl: string;
    alt: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const Swatch = React.forwardRef<HTMLDivElement, SwatchProps>(
    (
        {
            className,
            imageUrl,
            alt,
            size,
            isSelected = false,
            onClick,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    swatchVariants({
                        size,
                        variant: isSelected ? 'selected' : 'default'
                    }),
                    className
                )}
                title={alt}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick?.();
                    }
                }}
                {...props}
            >
                <img
                    src={`${imageUrl}?sw=60&q=60`}
                    alt={alt}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                />
            </div>
        );
    }
);
Swatch.displayName = 'Swatch';

interface ProductSwatchesProps
    extends React.ComponentProps<'div'>,
        ProductSwatchesVariantsProps {
    product: ShopperSearchTypes.ProductSearchHit;
    maxSwatches?: number;
    selectedColorValue?: string | null;
    onColorHover?: (colorValue: string | null) => void;
}

const ProductSwatches = React.forwardRef<HTMLDivElement, ProductSwatchesProps>(
    (
        {
            className,
            product,
            maxSwatches = 4,
            size,
            selectedColorValue,
            onColorHover,
            ...props
        },
        ref
    ) => {
        const swatches = React.useMemo(() => {
            if (!product) return [];

            const swatchData: Array<{
                imageUrl: string;
                alt: string;
                colorName: string;
                colorValue: string;
                isSelected?: boolean;
            }> = [];

            try {
                // Build color mapping from product-level variationAttributes
                const colorMap = new Map<string, string>();
                if (
                    product.variationAttributes &&
                    Array.isArray(product.variationAttributes)
                ) {
                    product.variationAttributes.forEach((attr) => {
                        if (
                            attr.id === 'color' &&
                            attr.values &&
                            Array.isArray(attr.values)
                        ) {
                            attr.values.forEach((value) => {
                                if (value.name && value.value) {
                                    colorMap.set(value.value, value.name);
                                }
                            });
                        }
                    });
                }

                // Extract swatch images from imageGroups with viewType: "swatch"
                if (product.imageGroups && Array.isArray(product.imageGroups)) {
                    product.imageGroups.forEach((imageGroup) => {
                        if (
                            imageGroup.viewType === 'swatch' &&
                            imageGroup.images &&
                            Array.isArray(imageGroup.images)
                        ) {
                            imageGroup.images.forEach((image) => {
                                if (image.disBaseLink || image.link) {
                                    let colorName = '';
                                    let colorValue = '';

                                    // Get color name and value from imageGroup variationAttributes first
                                    if (
                                        imageGroup.variationAttributes &&
                                        Array.isArray(
                                            imageGroup.variationAttributes
                                        )
                                    ) {
                                        imageGroup.variationAttributes.forEach(
                                            (attr) => {
                                                if (
                                                    attr.id === 'color' &&
                                                    attr.values &&
                                                    Array.isArray(attr.values)
                                                ) {
                                                    attr.values.forEach(
                                                        (value) => {
                                                            if (value.name) {
                                                                colorName =
                                                                    value.name;
                                                            }
                                                            if (value.value) {
                                                                colorValue =
                                                                    value.value;
                                                            }
                                                            if (
                                                                value.value &&
                                                                colorMap.has(
                                                                    value.value
                                                                )
                                                            ) {
                                                                colorName =
                                                                    colorMap.get(
                                                                        value.value
                                                                    ) || '';
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        );
                                    }

                                    swatchData.push({
                                        imageUrl: (image.disBaseLink ||
                                            image.link) as string,
                                        alt:
                                            colorName ||
                                            (image.alt as string) ||
                                            `Swatch ${swatchData.length + 1}`,
                                        colorName,
                                        colorValue,
                                        isSelected: false // Will be set below
                                    });
                                }
                            });
                        }
                    });
                }
            } catch {
                // Silently handle swatch processing errors to avoid console noise
                // The swatches will simply not be displayed if there's an error
            }

            // Set the selected swatch based on selectedColorValue, or first swatch as default
            if (swatchData.length > 0) {
                if (selectedColorValue) {
                    // Mark the selected swatch
                    swatchData.forEach((swatch) => {
                        swatch.isSelected =
                            swatch.colorValue === selectedColorValue;
                    });
                } else {
                    // If no selection, mark the first swatch as selected by default
                    swatchData[0].isSelected = true;
                }
            }

            return swatchData;
        }, [product, selectedColorValue]);

        if (swatches.length === 0) {
            return null;
        }

        const visibleSwatches = swatches.slice(0, maxSwatches);
        const hasMore = swatches.length > maxSwatches;

        return (
            <div
                ref={ref}
                className={cn(productSwatchesVariants({ size }), className)}
                {...props}
            >
                {visibleSwatches.map((swatch) => (
                    <Swatch
                        key={`${swatch.colorName}-${swatch.colorValue}-${swatch.imageUrl}`}
                        imageUrl={swatch.imageUrl}
                        alt={swatch.alt}
                        size={size}
                        isSelected={swatch.isSelected}
                        onMouseEnter={() => onColorHover?.(swatch.colorValue)}
                    />
                ))}

                {hasMore && (
                    <div
                        className={cn(
                            'rounded-full bg-muted border-2 border-border flex items-center justify-center',
                            size === 'sm'
                                ? 'w-4 h-4'
                                : size === 'md'
                                  ? 'w-6 h-6'
                                  : 'w-8 h-8'
                        )}
                    >
                        <span className="text-xs text-muted-foreground font-medium">
                            +{swatches.length - maxSwatches}
                        </span>
                    </div>
                )}
            </div>
        );
    }
);
ProductSwatches.displayName = 'ProductSwatches';

export { Swatch, ProductSwatches };
