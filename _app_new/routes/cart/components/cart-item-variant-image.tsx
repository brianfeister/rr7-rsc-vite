import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { findImageGroupBy } from '../../../utils/image-groups-utils';

type CartItemVariant = ShopperBasketsTypes.ProductItem &
    Partial<ShopperProductsTypes.Product>;

interface CartItemVariantImageProps {
    variant: CartItemVariant;
    className?: string;
    width?: string;
}

export default function CartItemVariantImage({
    variant,
    className = '',
    width
}: CartItemVariantImageProps): ReactElement {
    if (!variant) {
        return (
            <div
                className={`bg-muted rounded flex-shrink-0 ${
                    width ? `w-[${width}]` : 'w-16 sm:w-20'
                } ${className}`}
            >
                <div className="w-full h-full bg-muted rounded" />
            </div>
        );
    }

    // Find the 'small' images in the variant's image groups based on variationValues and pick the first one
    const imageGroup = findImageGroupBy(variant?.imageGroups, {
        viewType: 'small',
        selectedVariationAttributes: variant?.variationValues
    });
    const image = imageGroup?.images?.[0];

    return (
        <div
            className={`bg-muted rounded flex-shrink-0 ${
                width ? `w-[${width}]` : 'w-16 sm:w-20'
            } ${className}`}
        >
            {image ? (
                <img
                    src={`${image.disBaseLink || image.link}?sw=80&q=60`}
                    alt={
                        image.alt ||
                        variant.productName ||
                        variant.name ||
                        'Product image'
                    }
                    className="w-full h-full object-cover rounded"
                />
            ) : (
                <div className="w-full h-full bg-muted rounded" />
            )}
        </div>
    );
}
