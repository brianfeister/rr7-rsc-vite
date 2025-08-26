/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use client';

import type { ReactElement } from 'react';
import { Button } from '../ui/button';

export type VariantValue = {
    value: string;
    name: string;
    orderable?: boolean;
};

export type VariantAttribute = {
    id: string;
    name: string;
    values: VariantValue[];
};

interface VariantSelectorProps {
    attributes: VariantAttribute[];
    selected: Record<string, string>;
    onChange: (attributeId: string, value: string) => void;
}

export default function VariantSelector({
    attributes,
    selected,
    onChange
}: VariantSelectorProps): ReactElement {
    if (!attributes || attributes.length === 0) {
        return <></>;
    }

    const renderColorSwatch = (
        attribute: VariantAttribute,
        color: VariantValue
    ) => {
        const isSelected = selected[attribute.id] === color.value;
        const colorValue = (color.value || '').toLowerCase();

        return (
            <button
                key={color.value}
                onClick={() => onChange(attribute.id, color.value)}
                className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${
                        isSelected
                            ? 'border-foreground shadow-lg scale-110'
                            : 'border-border hover:border-border'
                    }
                `}
                style={{ backgroundColor: getColorValue(colorValue) }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
            >
                {isSelected && (
                    <div className="w-full h-full rounded-full border-2 border-background" />
                )}
            </button>
        );
    };

    const renderSizeSwatch = (
        attribute: VariantAttribute,
        size: VariantValue
    ) => {
        const isSelected = selected[attribute.id] === size.value;
        const isOrderable = size.orderable !== false;

        return (
            <Button
                key={size.value}
                onClick={() =>
                    isOrderable && onChange(attribute.id, size.value)
                }
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                disabled={!isOrderable}
                className={`
                    min-w-[3rem] h-10
                    ${!isOrderable ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {size.name}
            </Button>
        );
    };

    const renderDefaultSwatch = (
        attribute: VariantAttribute,
        value: VariantValue
    ) => {
        const isSelected = selected[attribute.id] === value.value;
        const isOrderable = value.orderable !== false;

        return (
            <Button
                key={value.value}
                onClick={() =>
                    isOrderable && onChange(attribute.id, value.value)
                }
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                disabled={!isOrderable}
                className={!isOrderable ? 'opacity-50 cursor-not-allowed' : ''}
            >
                {value.name}
            </Button>
        );
    };

    return (
        <div className="space-y-6">
            {attributes.map((attribute) => {
                const selectedValue = selected[attribute.id];
                const selectedValueName = attribute.values.find(
                    (v) => v.value === selectedValue
                )?.name;
                const availableValues = attribute.values || [];

                return (
                    <div key={attribute.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-foreground">
                                {attribute.name}
                            </h3>
                            {selectedValueName && (
                                <span className="text-sm text-muted-foreground">
                                    {selectedValueName}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {availableValues.map((value) => {
                                const idLower = attribute.id.toLowerCase();
                                if (idLower.includes('color')) {
                                    return renderColorSwatch(attribute, value);
                                } else if (idLower.includes('size')) {
                                    return renderSizeSwatch(attribute, value);
                                } else {
                                    return renderDefaultSwatch(
                                        attribute,
                                        value
                                    );
                                }
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function getColorValue(colorName: string): string {
    const colorMap: Record<string, string> = {
        black: '#000000',
        white: '#ffffff',
        red: '#dc2626',
        blue: '#2563eb',
        green: '#16a34a',
        yellow: '#eab308',
        pink: '#ec4899',
        purple: '#9333ea',
        gray: '#6b7280',
        grey: '#6b7280',
        brown: '#a3713e',
        navy: '#1e3a8a',
        beige: '#f5f5dc',
        tan: '#d2b48c',
        orange: '#ea580c'
    };

    return colorMap[colorName] || '#6b7280';
}
