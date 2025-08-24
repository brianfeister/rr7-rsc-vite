/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use client';

import { useState, type ReactElement } from 'react';

export type GalleryImage = {
    src: string;
    alt?: string;
    thumbSrc?: string;
};

interface ProductImageGalleryProps {
    images: GalleryImage[];
    eager?: boolean;
}

export default function ProductImageGallery({
    images,
    eager = false,
}: ProductImageGalleryProps): ReactElement {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">📷</div>
                    <p>No image available</p>
                </div>
            </div>
        );
    }

    const selectedImage = images[selectedImageIndex];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-full object-cover object-center"
                    loading={eager ? 'eager' : 'lazy'}
                />
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {images.map((image, index) => (
                        <button
                            key={image.src + (image.thumbSrc || '')}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`
                                aspect-square overflow-hidden rounded-lg bg-muted
                                border-2 transition-colors
                                ${selectedImageIndex === index 
                                    ? 'border-primary' 
                                    : 'border-transparent hover:border-border'
                                }
                            `}
                        >
                            <img
                                src={image.thumbSrc || image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover object-center"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


