import type { ReactElement } from 'react';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import ProductCard from '../product-card';

export default function ProductGrid({
    products
}: {
    products: ShopperSearchTypes.ProductSearchHit[];
}): ReactElement {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>

            {/* Show a message when no products are found */}
            {products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                        No products found.
                    </p>
                </div>
            )}
        </>
    );
}
