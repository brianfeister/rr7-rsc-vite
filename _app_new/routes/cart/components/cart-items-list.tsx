import type { ReactElement } from 'react';
import type { ShopperBasketsTypes, ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import CartItem from './cart-item';

interface CartItemsListProps {
    basket: ShopperBasketsTypes.Basket;
    productsByItemId?: Record<string, ShopperProductsTypes.Product>;
}

export default function CartItemsList({ 
    basket,
    productsByItemId
}: CartItemsListProps): ReactElement {
    return (
        <div className="space-y-4">
            {basket.productItems?.map((productItem) => {
                // Combine basket item with product data following reference logic
                const productData = productItem.itemId && productsByItemId 
                    ? productsByItemId[productItem.itemId] 
                    : undefined;
                const combinedProduct = {
                    ...productItem,
                    ...(productData || {}),
                    isProductUnavailable: !productData,
                    price: productItem.price,
                    quantity: productItem.quantity
                };

                return (
                    <CartItem
                        key={productItem.itemId}
                        product={combinedProduct}
                    />
                );
            })}
        </div>
    );
}
