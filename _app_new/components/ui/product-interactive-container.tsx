'use client';

import * as React from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import { ProductImageContainer } from './product-image-container';
import { ProductSwatches } from '../productCard/swatches';

interface ProductInteractiveContainerProps {
    product: ShopperSearchTypes.ProductSearchHit;
    maxSwatches?: number;
    swatchSize?: 'sm' | 'md' | 'lg';
    className?: string;
}

const ProductInteractiveContainer: React.FC<ProductInteractiveContainerProps> = ({ 
    product, 
    maxSwatches = 4,
    swatchSize = 'md',
    className 
}) => {
    const [selectedColorValue, setSelectedColorValue] = React.useState<string | null>(null);

    const handleColorHover = React.useCallback((colorValue: string | null) => {
        // Only update if a color is provided (hover), don't reset to null (leave)
        if (colorValue) {
            setSelectedColorValue(colorValue);
        }
    }, []);

    return (
        <div className={className}>
            {/* Product Image Container with color-aware image */}
            <ProductImageContainer 
                product={product} 
                selectedColorValue={selectedColorValue}
            />
            
            {/* Product Swatches */}
            <ProductSwatches 
                product={product}
                maxSwatches={maxSwatches}
                size={swatchSize}
                selectedColorValue={selectedColorValue}
                onColorHover={handleColorHover}
            />
        </div>
    );
};

export { ProductInteractiveContainer };
