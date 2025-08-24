import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { Card, CardContent } from '../../../components/ui/card';

import CartItemVariantImage from './cart-item-variant-image';
import CartItemVariantName from './cart-item-variant-name';
import CartItemVariantAttributes from './cart-item-variant-attributes';
import CartItemVariantPrice from './cart-item-variant-price';

type CartItemProduct = ShopperBasketsTypes.ProductItem &
    Partial<ShopperProductsTypes.Product>;

interface CartItemProps {
    product: CartItemProduct; // Combined basket item and product data
    primaryAction?: ReactElement;
}

export default function CartItem({
    product,
    primaryAction
}: CartItemProps): ReactElement {
    return (
        <div
            className="relative"
            data-testid={`sf-cart-item-${product.productId || product.id}`}
        >
            <Card className="border border-border shadow-sm">
                <CardContent className="p-4">
                    <div className="flex w-full items-start bg-background">
                        {/* Product Image */}
                        <CartItemVariantImage
                            variant={product}
                            className="mr-4 sm:mr-6"
                        />

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                                <CartItemVariantName variant={product} />
                                <CartItemVariantAttributes
                                    variant={product}
                                    includeQuantity={true}
                                />

                                {/* Mobile Price */}
                                <div className="sm:hidden mt-2">
                                    <CartItemVariantPrice variant={product} />
                                </div>
                            </div>

                            {/* Inventory Message */}
                            {product.showInventoryMessage && (
                                <div className="text-destructive font-semibold text-sm">
                                    {product.inventoryMessage}
                                </div>
                            )}
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden sm:block ml-4">
                            <CartItemVariantPrice variant={product} />
                        </div>
                    </div>

                    {/* Mobile Primary Action */}
                    {primaryAction && (
                        <div className="sm:hidden w-full mt-4">
                            {primaryAction}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
