import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { formatCurrency } from '../../../utils/currency';

type CartItemVariant = ShopperBasketsTypes.ProductItem &
    Partial<ShopperProductsTypes.Product>;

interface CartItemVariantPriceProps {
    variant: CartItemVariant;
    baseDirection?: 'row' | 'column';
    className?: string;
}

export default function CartItemVariantPrice({
    variant,
    baseDirection = 'column',
    className = ''
}: CartItemVariantPriceProps): ReactElement {
    if (!variant) {
        return (
            <div className={`text-sm font-medium ${className}`}>
                {formatCurrency(0)}
            </div>
        );
    }

    // Get price from variant
    const price = variant.price || variant.priceAfterItemDiscount || 0;
    const pricePerUnit = variant.pricePerUnit;
    const quantity = variant.quantity || 1;

    return (
        <div
            className={`flex ${
                baseDirection === 'row'
                    ? 'flex-row items-center gap-2'
                    : 'flex-col'
            } ${className}`}
        >
            <p className="text-sm font-medium">{formatCurrency(price)}</p>

            {/* Show price per unit if quantity > 1 and price per unit is available */}
            {quantity > 1 && pricePerUnit && (
                <p className="text-xs text-muted-foreground">
                    {formatCurrency(pricePerUnit)} ea
                </p>
            )}
        </div>
    );
}
