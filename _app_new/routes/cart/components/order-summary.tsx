import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { formatCurrency } from '../../../utils/currency';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import CartItemsSummary from './cart-items-summary';

interface OrderSummaryProps {
    basket: ShopperBasketsTypes.Basket;
    showPromoCodeForm?: boolean;
    showCartItems?: boolean;
    isEstimate?: boolean;
    productsByItemId?: Record<string, ShopperProductsTypes.Product>;
}

export default function OrderSummary({
    basket,
    showPromoCodeForm = false,
    showCartItems = true,
    isEstimate = false,
    productsByItemId = {}
}: OrderSummaryProps): ReactElement {
    if (!basket?.basketId && !basket?.orderNo) {
        return <div>No basket data available</div>;
    }

    const shippingItem = basket.shippingItems?.[0];
    const hasShippingPromos = (shippingItem?.priceAdjustments?.length ?? 0) > 0;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-5" data-testid="sf-order-summary">
                    <h2 className={`font-bold pt-1`} id="order-summary-heading">
                        Order Summary
                    </h2>

                    <div
                        className="space-y-4"
                        role="region"
                        aria-labelledby="order-summary-heading"
                    >
                        {/* Cart Items Accordion */}
                        {showCartItems && (
                            <CartItemsSummary
                                basket={basket}
                                productsByItemId={productsByItemId}
                            />
                        )}

                        {/* Order Summary Details */}
                        <div className="space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Subtotal</span>
                                <span className="font-bold">
                                    {formatCurrency(
                                        basket?.productSubTotal || 0
                                    )}
                                </span>
                            </div>

                            {/* Order Price Adjustments */}
                            {basket.orderPriceAdjustments?.map((adjustment) => (
                                <div
                                    key={adjustment.priceAdjustmentId}
                                    className="flex justify-between items-center"
                                >
                                    <span>{adjustment.itemText}</span>
                                    <span className="text-primary">
                                        {formatCurrency(adjustment.price ?? 0)}
                                    </span>
                                </div>
                            ))}

                            {/* Shipping */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span>Shipping</span>
                                    {hasShippingPromos && (
                                        <span className="ml-1 text-sm text-muted-foreground">
                                            (Promotion applied)
                                        </span>
                                    )}
                                </div>
                                {shippingItem?.priceAdjustments?.some(
                                    ({ appliedDiscount }) =>
                                        appliedDiscount?.type === 'free'
                                ) ? (
                                    <span className="text-primary uppercase font-medium">
                                        Free
                                    </span>
                                ) : (
                                    <span>
                                        {formatCurrency(
                                            basket.shippingTotal || 0
                                        )}
                                    </span>
                                )}
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between items-center">
                                <span>Tax</span>
                                {basket.taxTotal != null ? (
                                    <span>
                                        {formatCurrency(basket.taxTotal)}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">
                                        TBD
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Promo Code Form */}
                        {showPromoCodeForm ? (
                            <div className="w-full">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Enter promo code"
                                        className="w-full"
                                        disabled
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Separator className="w-full" />
                        )}

                        {/* Total */}
                        <div className="space-y-4 w-full">
                            <div className="flex w-full justify-between items-center">
                                <span className="font-bold">
                                    {isEstimate
                                        ? 'Estimated Total'
                                        : 'Order Total'}
                                </span>
                                <span className="font-bold">
                                    {formatCurrency(
                                        basket?.orderTotal ||
                                            basket?.productTotal ||
                                            0
                                    )}
                                </span>
                            </div>

                            {/* Applied Promotions */}
                            {(basket.couponItems?.length ?? 0) > 0 && (
                                <div className="p-4 border border-border rounded bg-background">
                                    <p className="font-medium mb-2">
                                        Promotions applied:
                                    </p>
                                    <div className="space-y-2">
                                        {basket.couponItems?.map((item) => (
                                            <div
                                                key={item.couponItemId}
                                                className="flex items-center"
                                            >
                                                <span className="flex-1 text-sm text-foreground">
                                                    {item.code}
                                                </span>
                                                {!basket.orderNo && (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive/80 p-0 h-auto"
                                                        disabled
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
