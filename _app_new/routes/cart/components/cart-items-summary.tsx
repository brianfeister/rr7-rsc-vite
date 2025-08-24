import type { ReactElement } from 'react';
import type {
    ShopperBasketsTypes,
    ShopperProductsTypes
} from 'commerce-sdk-isomorphic';
import { Button } from '../../../components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '../../../components/ui/accordion';
import { ShoppingCart } from 'lucide-react';
import CartItemVariantImage from './cart-item-variant-image';
import CartItemVariantName from './cart-item-variant-name';
import CartItemVariantAttributes from './cart-item-variant-attributes';
import CartItemVariantPrice from './cart-item-variant-price';

interface CartItemsSummaryProps {
    basket: ShopperBasketsTypes.Basket;
    productsByItemId?: Record<string, ShopperProductsTypes.Product>;
}

export default function CartItemsSummary({
    basket,
    productsByItemId = {}
}: CartItemsSummaryProps): ReactElement {
    const totalItems =
        basket?.productItems?.reduce(
            (acc, item) => acc + (item.quantity ?? 0),
            0
        ) || 0;

    // TODO: use react-intl to get the item count text
    const getItemCountText = (count: number): string => {
        if (count === 0) return '0 items in cart';
        if (count === 1) return '1 item in cart';
        return `${count} items in cart`;
    };

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cart-items">
                <AccordionTrigger className="text-left">
                    <span className="flex-1 text-left text-base text-primary">
                        <ShoppingCart className="inline mr-2 w-4 h-4" />
                        {getItemCountText(totalItems)}
                    </span>
                </AccordionTrigger>
                <AccordionContent className="px-0 py-4">
                    <div className="space-y-5">
                        {basket.productItems?.map((product) => {
                            const variant = {
                                ...product,
                                ...(productsByItemId && product.itemId
                                    ? productsByItemId[product.itemId]
                                    : {}),
                                price: product.price
                            };

                            return (
                                <div
                                    key={product.itemId}
                                    className="flex w-full items-start"
                                >
                                    <CartItemVariantImage
                                        variant={variant}
                                        width="80px"
                                        className="mr-2"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <CartItemVariantName
                                            variant={variant}
                                        />
                                        <CartItemVariantAttributes
                                            variant={variant}
                                            includeQuantity
                                        />
                                        <CartItemVariantPrice
                                            variant={variant}
                                            baseDirection="row"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <Button variant="link" className="w-full p-0 h-auto">
                            Edit cart
                        </Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
