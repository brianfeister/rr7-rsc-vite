import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';

export default function Hero({
    title,
    subtitle,
    imageUrl,
    imageAlt,
    ctaText = 'Shop Now',
    ctaLink = '/category/root'
}: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    imageAlt: string;
    ctaText?: string;
    ctaLink?: string;
}): ReactElement {
    return (
        <div className="w-full bg-muted/30 border-border/60">
            {/* Two-column layout container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-background ring-primary">
                <div className="flex flex-col md:flex-row w-full border-destructive/40">
                    {/* Left column - Content */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-secondary/20 text-secondary">
                        <div className="max-w-xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                {title}
                            </h1>

                            {subtitle && (
                                <p className="text-lg text-foreground/80 mb-8">
                                    {subtitle}
                                </p>
                            )}

                            <Button asChild className="text-xl p-6">
                                <Link to={ctaLink}>{ctaText}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right column - Image */}
                    <div className="w-full md:w-1/2 relative md:h-auto lg:h-[530px]">
                        {/* <img src={imageUrl} alt={imageAlt} fetchPriority="high" className="object-cover" /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
