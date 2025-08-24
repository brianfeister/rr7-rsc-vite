import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { getDisplayVariationValues } from '../../../utils/product-utils';

type CartItemVariant = ShopperBasketsTypes.ProductItem &
    Partial<ShopperProductsTypes.Product>;

interface CartItemVariantAttributesProps {
    variant: CartItemVariant;
    includeQuantity?: boolean;
    className?: string;
}

export default function CartItemVariantAttributes({
    variant,
    includeQuantity = false,
    className = ''
}: CartItemVariantAttributesProps): ReactElement {
    if (!variant) {
        return (
            <div className={`space-y-1 ${className}`}>
                <p className="text-sm text-muted-foreground">Qty: 1</p>
            </div>
        );
    }

    // Get human-friendly variation values using the utility function
    const variationValues = getDisplayVariationValues(
        variant?.variationAttributes,
        variant?.variationValues
    );

    // Get quantity
    const quantity = variant.quantity || 1;

    return (
        <div className={`space-y-1 ${className}`}>
            {/* Display variation attributes */}
            {Object.keys(variationValues).map((key) => (
                <p key={key} className="text-sm text-muted-foreground">
                    {key}: {variationValues[key]}
                </p>
            ))}

            {/* Display quantity if requested */}
            {includeQuantity && (
                <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
            )}
        </div>
    );
}
