import type { ReactElement } from 'react';
import type { ShopperBasketsTypes, ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import { Link } from 'react-router';

type CartItemVariant = ShopperBasketsTypes.ProductItem & Partial<ShopperProductsTypes.Product>;

interface CartItemVariantNameProps {
    variant: CartItemVariant;
    className?: string;
}

export default function CartItemVariantName({ 
    variant,
    className = ''
}: CartItemVariantNameProps): ReactElement {
    if (!variant) {
        return <div className={`text-sm font-medium ${className}`}>Product Name</div>;
    }

    const productId = variant.master?.masterId || variant.id || variant.productId;
    const productName = variant.productName || variant.name || 'Product Name';

    return (
        <h3 className={`text-sm font-medium ${className}`}>
            <Link 
                to={`/product/${productId}`}
                className="text-foreground hover:text-primary"
            >
                {productName}
            </Link>
        </h3>
    );
}
