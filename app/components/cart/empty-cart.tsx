import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ShoppingCart, User } from 'lucide-react';

interface EmptyCartProps {
    isRegistered?: boolean;
}

export default function EmptyCart({
    isRegistered = false
}: EmptyCartProps): ReactElement {
    return (
        <div
            className="bg-muted flex-1 min-w-full w-full"
            data-testid="sf-cart-empty"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-6">
                            {/* Empty Cart Icon */}
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            </div>

                            {/* Empty Cart Message */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Your cart is empty.
                                </h2>
                                <p className="text-muted-foreground">
                                    {isRegistered
                                        ? 'Continue shopping to add items to your cart.'
                                        : 'Sign in to retrieve your saved items or continue shopping.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link to="/">Continue Shopping</Link>
                                </Button>

                                {!isRegistered && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link
                                            to="/account"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
