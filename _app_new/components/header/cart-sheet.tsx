'use client';

import { type PropsWithChildren, type ReactElement, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../providers/cart-store';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../ui/sheet';
import { Button } from '../ui/button';

export default function CartSheet({
    children
}: PropsWithChildren): ReactElement {
    // As this component gets loaded on demand, it immediately gets displayed open
    const [open, setOpen] = useState<boolean>(true);

    // Use shallow equality check to prevent unnecessary re-renders
    const { cart } = useCartStore(
        useShallow((state) => ({
            cart: state.cart
        }))
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="md:w-1/3 md:max-w-1/3">
                <SheetHeader>
                    <SheetTitle>Your Shopping Cart</SheetTitle>
                    <SheetDescription>{JSON.stringify(cart)}</SheetDescription>
                    <SheetFooter>
                        <Button type="submit">Checkout</Button>
                        <SheetClose asChild>
                            <Button variant="outline">Continue Shopping</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
