import type { ReactElement } from 'react';
import type { ShopperBasketsTypes } from 'commerce-sdk-isomorphic';

interface CartTitleProps {
    basket: ShopperBasketsTypes.Basket;
}

export default function CartTitle({ basket }: CartTitleProps): ReactElement {
    // Calculate total items by summing up the quantity of each product item
    const totalItems = basket?.productItems?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) || 0;
    
    const getItemCountText = (count: number): string => {
        if (count === 0) return 'Cart (0 items)';
        if (count === 1) return 'Cart (1 item)';
        return `Cart (${count} items)`;
    };

    return (
        <h1 className="text-xl lg:text-2xl font-bold">
            {getItemCountText(totalItems)}
        </h1>
    );
}
