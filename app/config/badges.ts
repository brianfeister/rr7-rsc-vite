// Badge configuration for product cards
export interface BadgeDetail {
    propertyName: string;
    label: string;
    color: 'green' | 'yellow' | 'orange' | 'purple' | 'red' | 'blue' | 'pink';
    priority?: number; // Higher number = higher priority (shown first)
}

// Default badge configuration
export const PRODUCT_BADGE_DETAILS: BadgeDetail[] = [
    {
        propertyName: 'c_isNew',
        label: 'New',
        color: 'green',
        priority: 1
    },
    {
        propertyName: 'c_isSale',
        label: 'Sale',
        color: 'orange',
        priority: 2
    },
    {
        propertyName: 'c_isLimited',
        label: 'Limited',
        color: 'purple',
        priority: 3
    },
    {
        propertyName: 'c_isExclusive',
        label: 'Exclusive',
        color: 'blue',
        priority: 4
    },
    {
        propertyName: 'c_isTrending',
        label: 'Trending',
        color: 'pink',
        priority: 5
    },
    {
        propertyName: 'c_isBestSeller',
        label: 'Best Seller',
        color: 'yellow',
        priority: 6
    },
    {
        propertyName: 'c_isOutOfStock',
        label: 'Out of Stock',
        color: 'red',
        priority: 7
    }
];

// Badge color variants for Tailwind CSS - matching the image design
export const BADGE_COLOR_VARIANTS = {
    green: 'bg-green-200 text-black',      // Light green for NEW
    orange: 'bg-orange-200 text-black',    // Light orange for SALE
    yellow: 'bg-yellow-200 text-black',    // Light yellow
    purple: 'bg-purple-200 text-black',    // Light purple
    red: 'bg-red-200 text-black',          // Light red
    blue: 'bg-blue-200 text-black',        // Light blue
    pink: 'bg-pink-200 text-black'         // Light pink
} as const;

// Helper function to get badge color class
export const getBadgeColorClass = (color: BadgeDetail['color']): string => {
    return BADGE_COLOR_VARIANTS[color];
};
