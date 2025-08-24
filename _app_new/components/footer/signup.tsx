'use client';

import { type FormEvent, type ReactElement, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Signup(): ReactElement {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (inputRef.current?.value?.trim()) {
                const email = inputRef.current.value;
                // eslint-disable-next-line no-alert
                alert(`Signup email address: ${email}`);
            }
        },
        [inputRef]
    );

    return (
        <>
            <h3 className="text-lg text-primary-foreground font-semibold">
                Be the first to know
            </h3>
            <p className="text-primary-foreground text-sm">
                Sign up to stay in the loop about the hottest deals
            </p>
            <form
                onSubmit={handleSubmit}
                className="flex mt-4 w-full max-w-sm items-center gap-2"
            >
                <Input
                    ref={inputRef}
                    type="email"
                    placeholder="Your email"
                    className="text-primary-foreground"
                />
                <Button type="submit" variant="outline">
                    Subscribe
                </Button>
            </form>
        </>
    );
}
