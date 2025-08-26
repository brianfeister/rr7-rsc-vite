/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use client';

import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type SafePortalProps = {
    children: ReactNode;
    container?: globalThis.HTMLElement | null;
    containerId?: string;
    fallback?: ReactNode;
    disabled?: boolean;
};

/**
 * Safely renders children into a DOM portal on the client.
 * - No-op on the server (returns null or fallback)
 * - Targets a provided container, an element by id, or document.body
 */
export default function SafePortal({
    children,
    container,
    containerId,
    fallback = null,
    disabled = false,
}: SafePortalProps): ReactElement | null {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const target = useMemo<globalThis.HTMLElement | null>(() => {
        if (disabled) return null;
        if (container) return container;
        if (containerId) return typeof document !== 'undefined' ? document.getElementById(containerId) : null;
        return typeof document !== 'undefined' ? document.body : null;
    }, [container, containerId, disabled]);

    if (!isMounted || !target) return fallback as ReactElement | null;
    return createPortal(children, target);
}

export type { SafePortalProps };


