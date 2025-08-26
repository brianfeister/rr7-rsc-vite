import { cva, type VariantProps } from 'class-variance-authority';

// Badge container variants with proper ShadCN patterns
const productBadgesVariants = cva(
    'absolute top-2 left-2 z-10 flex flex-row gap-1 pointer-events-none',
    {
        variants: {
            variant: {
                default: '',
                compact: 'gap-0.5',
                stacked: 'flex-col gap-0.5',
            },
            size: {
                sm: 'gap-0.5',
                md: 'gap-1',
                lg: 'gap-1.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

// Individual badge variants with proper styling - matching the image design
const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide shadow-sm border-0',
    {
        variants: {
            variant: {
                default: '',
                outline: 'border border-gray-300 bg-white/90 backdrop-blur-sm text-foreground',
                solid: 'border-0',
            },
            size: {
                sm: 'px-1.5 py-0.5 text-xs',
                md: 'px-2 py-1 text-xs',
                lg: 'px-2.5 py-1.5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'solid',
            size: 'md',
        },
    }
);

export { badgeVariants, productBadgesVariants };
export type BadgeVariantsProps = VariantProps<typeof badgeVariants>;
export type ProductBadgesVariantsProps = VariantProps<typeof productBadgesVariants>;
