import * as React from 'react';
import { Link } from 'react-router';
import type { ShopperSearchTypes } from 'commerce-sdk-isomorphic';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../utils/currency';
import { Card, CardContent, CardFooter } from '../ui/card';
import { ProductInteractiveContainer } from '../ui/product-interactive-container';
import { productCardVariants, type ProductCardVariantsProps } from './variants';

interface ProductCardProps
    extends React.ComponentProps<'div'>,
        ProductCardVariantsProps {
    product: ShopperSearchTypes.ProductSearchHit;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
    ({ className, product, variant, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(productCardVariants({ variant }), className)}
                {...props}
            >
                <Card className="ring-secondary/40 bg-muted/50">
                    <CardContent className="text-secondary border-destructive/30">
                        <div className="group bg-accent/30">
                            {/* Product Interactive Container (Client Component) */}
                            <ProductInteractiveContainer
                                product={product}
                                maxSwatches={4}
                                swatchSize="md"
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        {/* Product Info */}
                        <Link
                            to={`/product/${product.productId}`}
                            className="block w-full group-hover:underline transition-colors duration-200"
                        >
                            <h3 className="text-lg font-medium text-foreground">
                                {product.productName}
                            </h3>

                            <p className="mt-2 font-medium text-foreground">
                                {formatCurrency(product.price ?? 0)}
                            </p>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };
export default ProductCard;
