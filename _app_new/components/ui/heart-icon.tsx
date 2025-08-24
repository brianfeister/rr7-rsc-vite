'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface HeartIconProps {
    isFilled?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
}

const HeartIcon: React.FC<HeartIconProps> = ({ 
    isFilled = false, 
    disabled = false, 
    size = 'md', 
    className, 
    onClick 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <button
            className={cn(
                'absolute top-2 right-2 z-10 bg-background rounded-full p-1.5 shadow-md',
                'transition-all duration-200 ease-in-out border-0',
                'hover:scale-110 hover:shadow-lg',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                className
            )}
            disabled={disabled}
            onClick={onClick}
            aria-label={isFilled ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className={cn(
                    sizeClasses[size],
                    'transition-colors duration-200',
                    isFilled ? 'text-red-500' : 'text-gray-600'
                )}
                viewBox={isFilled ? '0 0 20 19' : '0 0 22 20'}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {isFilled ? (
                    <path
                        d="m10,2.07c1.1586,-1.26976 2.7819,-2.01646 4.5,-2.07c3.0376,0 5.5,2.46243 5.5,5.5c0,3.59623 -3.9978,7.5375 -6.3954,9.9013c-0.2159,0.2128 -0.4188,0.4129 -0.6046,0.5987l-2.28,2.28c-0.1405,0.1407 -0.3312,0.2198 -0.53,0.22l-0.38,0c-0.19884,-0.0002 -0.38948,-0.0793 -0.53,-0.22l-2.28,-2.28c-0.18584,-0.1858 -0.38873,-0.3859 -0.6046,-0.5987c-2.39765,-2.3638 -6.3954,-6.30507 -6.3954,-9.9013c0,-3.03757 2.46243,-5.5 5.5,-5.5c1.7181,0.05354 3.34137,0.80024 4.5,2.07z"
                        fill="currentColor"
                    />
                ) : (
                    <path
                        d="M6.37862 1.00005C4.99671 1.00005 3.6222 1.54619 2.57466 2.64249C0.479536 4.83503 0.473517 8.35409 2.56622 10.5483L10.9486 19.3391C11.1515 19.5536 11.5371 19.5536 11.74 19.3391C14.5362 16.4128 17.3261 13.4832 20.1224 10.5568C22.2175 8.36421 22.2175 4.84358 20.1224 2.651C18.0273 0.458421 14.601 0.458372 12.5059 2.651L11.3486 3.85091L10.1912 2.64249C9.06169 1.45591 7.66226 0.994307 6.37868 1.00005H6.37862ZM6.37862 2.07231C7.46763 2.07231 8.56236 2.5147 9.40819 3.39988L10.957 5.02529C11.1599 5.23982 11.5455 5.23982 11.7485 5.02529L13.2888 3.40839C14.9804 1.63801 17.6477 1.63805 19.3394 3.40839C21.031 5.17873 21.031 8.03757 19.3394 9.8079C16.6761 12.5951 14.0117 15.3861 11.3485 18.1733L3.35758 9.79941C1.6671 8.02688 1.66595 5.17018 3.35758 3.39988C4.20338 2.51471 5.28961 2.07231 6.37862 2.07231Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                )}
            </svg>
        </button>
    );
};

export { HeartIcon };
