/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

'use client';

import { useCallback, type ReactNode } from 'react';
import SafePortal from '@/components/safe-portal';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { ToastContext, type ToastType } from './toast-context'; 

export function ToastProvider({ children }: { children: ReactNode }) {
    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
        let id: string | number;

        if (type === 'success') {
            id = sonnerToast.success(message, {
                duration,
                action: {
                    label: 'Close',
                    onClick: () => sonnerToast.dismiss(id),
                },
            });
        } else if (type === 'error') {
            id = sonnerToast.error(message, {
                duration,
                action: {
                    label: 'Close',
                    onClick: () => sonnerToast.dismiss(id),
                },
            });
        } else {
            id = sonnerToast(message, {
                duration,
                action: {
                    label: 'Close',
                    onClick: () => sonnerToast.dismiss(id),
                },
            });
        }
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <SafePortal containerId="toast-root">
                <SonnerToaster richColors expand position="top-right" />
            </SafePortal>
        </ToastContext.Provider>
    );
}
