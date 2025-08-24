/**
 * Get the human-friendly version of the variation values that users have selected.
 * Useful for displaying these values in the UI.
 *
 * @param variationAttributes - The products variation attributes.
 * @param values - The variations selected attribute values.
 * @returns A key value map of the display name and display value.
 *
 * @example
 * const displayValues = getDisplayVariationValues(
 *     [ { 
 *         "id": "color", 
 *         "name": "Colour", 
 *         "values": [ { "name": "royal", "orderable": true, "value": "JJ5FUXX" } ] 
 *     } ],
 *     { "color": "JJ5FUXX" }
 * )
 * // returns { "Colour": "royal" }
 */

import type { ShopperProductsTypes } from 'commerce-sdk-isomorphic';

export const getDisplayVariationValues = (
    variationAttributes: ShopperProductsTypes.VariationAttribute[] = [], 
    values: Record<string, string> = {}
): Record<string, string> => {
    const returnVal = Object.entries(values).reduce(
        (acc: Record<string, string>, [id, value]) => {
            const attribute = variationAttributes.find(
                ({ id: attributeId }) => attributeId === id
            );
            if (attribute && attribute.name) {
                const attributeValue = attribute.values?.find(
                    ({ value: attributeValue }) => attributeValue === value
                );
                if (attributeValue && attributeValue.name) {
                    return {
                        ...acc,
                        [attribute.name]: attributeValue.name
                    };
                }
            }
            return acc;
        }, 
        {}
    );
    return returnVal;
};
