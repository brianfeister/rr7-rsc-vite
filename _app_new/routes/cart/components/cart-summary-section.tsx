import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import OrderSummary from './order-summary';
import CartCta from '../../../components/cart/cart-cta';

interface CartSummarySectionProps {
    basket: ShopperBasketsTypes.Basket;
    isDesktop: boolean;
    productsByItemId?: Record<string, ShopperProductsTypes.Product>;
}

export default function CartSummarySection({
    basket,
    isDesktop,
    productsByItemId
}: CartSummarySectionProps): ReactElement {
    if (isDesktop) {
        return (
            <div className="space-y-4">
                <OrderSummary
                    showPromoCodeForm={true}
                    isEstimate={true}
                    basket={basket}
                    productsByItemId={productsByItemId}
                />
                <div className="hidden lg:block">
                    <CartCta />
                </div>
            </div>
        );
    }

    // Mobile sticky version
    return (
        <div className="h-32 sticky bottom-0 bg-background flex items-center flex-col lg:hidden">
            <CartCta />
        </div>
    );
}
