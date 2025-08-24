/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use client';

import { type ReactElement, useEffect, useState } from 'react';
import type { ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import { Button } from '../../../components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '../../../components/ui/card';
import { formatCurrency } from '../../../utils/currency';
import { useProductSetsBundles } from '../hooks/use-product-sets-bundles';
import { useProductActions } from '../hooks/use-product-actions';
import ProductImageGallery from '../../../components/product-image-gallery';
import VariantSelector from '../../../components/variant-selector';
import QuantitySelector from '../../../components/quantity-selector';
import { useVariantSelection } from '../hooks/use-variant-selection';

interface ProductSetBundleProps {
    product: ShopperProductsTypes.Product;
    isProductASet?: boolean;
    isProductABundle?: boolean;
}

interface ProductSelectionValues {
    product: ShopperProductsTypes.Product;
    variant: ShopperProductsTypes.Variant;
    quantity: number;
}

export default function ProductSetBundle({
    product,
    isProductASet = false,
    isProductABundle = false
}: ProductSetBundleProps): ReactElement {
    const {
        comboProduct,
        childProductSelection,
        selectedBundleQuantity,
        areAllChildProductsSelected,
        hasUnorderableChildProducts,
        handleChildProductValidation,
        setChildProductSelection,
        setSelectedBundleQuantity,
        selectedChildProductCount,
        totalChildProducts
    } = useProductSetsBundles({
        product,
        isProductASet,
        isProductABundle
    });

    const {
        isAddingToCart,
        handleProductSetAddToCart,
        handleProductBundleAddToCart
    } = useProductActions({
        product,
        isProductASet,
        isProductABundle
    });

    const childProducts = comboProduct.childProducts || [];

    const handleAddToCart = async () => {
        // Validate all child products are selected
        if (!handleChildProductValidation()) {
            return;
        }

        if (isProductASet) {
            const selectedProducts = Object.values(childProductSelection);
            await handleProductSetAddToCart(selectedProducts);
        } else if (isProductABundle) {
            const selectedProducts = Object.values(childProductSelection);
            await handleProductBundleAddToCart(
                product,
                selectedBundleQuantity,
                selectedProducts
            );
        }
    };

    const canAddToCart =
        areAllChildProductsSelected && !hasUnorderableChildProducts;

    if (!isProductASet && !isProductABundle) {
        return <></>;
    }

    return (
        <div className="space-y-8">
            {/* Set/Bundle Header */}
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                    {isProductASet ? 'Product Set' : 'Product Bundle'}
                </h2>
                <p className="text-muted-foreground">
                    {isProductASet
                        ? 'Choose from the items below to create your perfect set'
                        : 'All items in this bundle will be added to your cart together'}
                </p>

                {/* Progress indicator */}
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <span>
                        {selectedChildProductCount} of {totalChildProducts}{' '}
                        selected
                    </span>
                    <div className="w-32 bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${
                                    (selectedChildProductCount /
                                        totalChildProducts) *
                                    100
                                }%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Child Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {childProducts.map(
                    (
                        childProduct: ShopperProductsTypes.Product,
                        index: number
                    ) => (
                        <ChildProductCard
                            key={childProduct.product.id}
                            childProduct={childProduct}
                            index={index}
                            isProductASet={isProductASet}
                            isProductABundle={isProductABundle}
                            onSelectionChange={(selection) =>
                                setChildProductSelection(
                                    childProduct.product.id,
                                    selection
                                )
                            }
                        />
                    )
                )}
            </div>

            {/* Bundle Quantity Selector (for bundles only) */}
            {isProductABundle && (
                <div className="flex justify-center">
                    <div className="w-64">
                        <QuantitySelector
                            quantity={selectedBundleQuantity}
                            onQuantityChange={setSelectedBundleQuantity}
                            maxQuantity={10}
                        />
                    </div>
                </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart || isAddingToCart}
                    size="lg"
                    className="min-w-64"
                >
                    {isAddingToCart
                        ? 'Adding...'
                        : isProductASet
                          ? 'Add Set to Cart'
                          : 'Add Bundle to Cart'}
                </Button>
            </div>

            {/* Error Messages */}
            {!areAllChildProductsSelected && (
                <div className="text-center text-destructive">
                    Please select all your options above
                </div>
            )}
        </div>
    );
}

// Child Product Card Component
interface ChildProductCardProps {
    childProduct: ShopperProductsTypes.Product | ShopperProductsTypes.Variant;
    index: number;
    isProductASet: boolean;
    isProductABundle: boolean;
    onSelectionChange: (selection: ProductSelectionValues) => void;
}

function ChildProductCard({
    childProduct,
    index: _index,
    isProductASet,
    isProductABundle,
    onSelectionChange
}: ChildProductCardProps): ReactElement {
    const product = childProduct.product;

    const {
        currentVariant,
        selectedAttributes,
        isVariantFullySelected,
        handleAttributeChange,
        getAvailableValues
    } = useVariantSelection({
        product
    });

    const [quantity, setQuantity] = useState(childProduct.quantity || 1);

    // Update parent when selection changes
    useEffect(() => {
        if (isVariantFullySelected && currentVariant) {
            onSelectionChange({
                product,
                variant: currentVariant,
                quantity
            });
        }
    }, [
        currentVariant,
        quantity,
        isVariantFullySelected,
        product,
        onSelectionChange
    ]);

    const price = currentVariant?.price || product.price || 0;
    const isInStock =
        (currentVariant?.inventory?.ats || product.inventory?.ats || 0) > 0;

    return (
        <Card className="h-full" data-testid="child-product">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="text-xl font-bold text-foreground">
                    {formatCurrency(price)}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Product Image */}
                <div className="aspect-square">
                    <ProductImageGallery
                        images={
                            (product.imageGroups || [])
                                .find(
                                    (group: ShopperProductsTypes.ImageGroup) =>
                                        group.viewType === 'large'
                                )
                                ?.images?.map(
                                    (img: ShopperProductsTypes.Image) => ({
                                        src: `${
                                            img.disBaseLink || img.link
                                        }?sw=600&q=85`,
                                        alt: img.alt || product.name,
                                        thumbSrc: `${
                                            img.disBaseLink || img.link
                                        }?sw=150&q=75`
                                    })
                                ) || []
                        }
                        eager={isProductASet || isProductABundle ? false : true}
                    />
                </div>

                {/* Variant Selection */}
                {product.variationAttributes &&
                    product.variationAttributes.length > 0 && (
                        <VariantSelector
                            attributes={product.variationAttributes.map(
                                (
                                    attr: ShopperProductsTypes.VariationAttribute
                                ) => ({
                                    id: attr.id,
                                    name: attr.name ?? '',
                                    values: getAvailableValues(attr.id).map(
                                        (
                                            v: ShopperProductsTypes.VariationAttributeValue
                                        ) => ({
                                            value: v.value,
                                            name: v.name ?? String(v.value),
                                            orderable: v.orderable
                                        })
                                    )
                                })
                            )}
                            selected={selectedAttributes}
                            onChange={handleAttributeChange}
                        />
                    )}

                {/* Quantity for Product Sets */}
                {isProductASet && (
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        maxQuantity={10}
                    />
                )}

                {/* Stock Status */}
                {!isInStock && (
                    <div className="text-destructive font-medium text-center">
                        Out of stock
                    </div>
                )}

                {/* Selection Status */}
                <div className="text-center text-sm">
                    {isVariantFullySelected ? (
                        <span className="text-primary font-medium">
                            ✓ Selected
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            Select options above
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
