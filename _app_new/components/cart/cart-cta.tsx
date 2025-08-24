import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { VisaIcon, MastercardIcon, AmexIcon, DiscoverIcon } from '@/components/icons';

export default function CartCta(): ReactElement {
    return (
        <>
            <Button asChild className="w-full sm:w-[95%] lg:w-full mt-6 sm:mt-6 lg:mt-2 mb-4">
                <Link to="/checkout">
                    Proceed to Checkout
                    <Lock className="ml-2 w-4 h-4" aria-label="Secure" />
                </Link>
            </Button>
            
            <div className="flex justify-center">
                <VisaIcon width={40} height={32} className="mr-2" />
                <MastercardIcon width={40} height={32} className="mr-2" />
                <AmexIcon width={40} height={32} className="mr-2" />
                <DiscoverIcon width={40} height={32} className="mr-2" />
            </div>
        </>
    );
}
