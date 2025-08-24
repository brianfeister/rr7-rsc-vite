/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import type { ReactElement } from 'react';
import type { ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import ProductImageGallery from '../../../components/product-image-gallery';
import ProductInfo from './product-info';
import ProductAccordion from './product-accordion';
import ProductSetBundle from './product-set-bundle';
import QuantitySection from './quantity-section';
import CategoryBreadcrumbs from '../../../components/category-breadcrumbs';

interface ProductDetailViewProps {
    product: ShopperProductsTypes.Product;
    category?: ShopperProductsTypes.Category;
    isProductASet?: boolean;
    isProductABundle?: boolean;
}

export default function ProductDetailView({
    product,
    category,
    isProductASet = false,
    isProductABundle = false
}: ProductDetailViewProps): ReactElement {
    // Build breadcrumb data from category
    const breadcrumbData = category?.parentCategoryTree || [];

    return (
        <div className="space-y-8">
            {/* Breadcrumbs */}
            {breadcrumbData.length > 0 && category && (
                <div className="hidden md:block">
                    <CategoryBreadcrumbs category={category} />
                </div>
            )}

            {/* Mobile Product Title - shown on mobile only */}
            <div className="block md:hidden">
                <h1 className="text-2xl font-bold text-foreground">
                    {product.name}
                </h1>
                {product.shortDescription && (
                    <p className="mt-2 text-muted-foreground">
                        {product.shortDescription}
                    </p>
                )}
            </div>

            {/* Product Sets/Bundles or Regular Product */}
            {isProductASet || isProductABundle ? (
                <ProductSetBundle
                    product={product}
                    isProductASet={isProductASet}
                    isProductABundle={isProductABundle}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Image Gallery */}
                    <div className="order-1">
                        <ProductImageGallery
                            images={
                                (product.imageGroups || [])
                                    .find(
                                        (
                                            group: ShopperProductsTypes.ImageGroup
                                        ) => group.viewType === 'large'
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
                            eager={!isProductASet && !isProductABundle}
                        />
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="order-2">
                        <ProductInfo
                            product={product}
                            category={category}
                            isProductASet={isProductASet}
                            isProductABundle={isProductABundle}
                        />
                    </div>
                </div>
            )}

            {/* Quantity Section for regular products */}
            <QuantitySection
                product={product}
                isProductASet={isProductASet}
                isProductABundle={isProductABundle}
            />

            {/* Product Information Accordion */}
            <div className="mt-16">
                <ProductAccordion product={product} />
            </div>
        </div>
    );
}
