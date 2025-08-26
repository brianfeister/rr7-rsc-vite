'use client';

import { createContext, type PropsWithChildren, type ReactElement } from 'react';
import type { CommerceContext } from './commerce';

// eslint-disable-next-line react-refresh/only-export-components
export const CommerceClientContext = createContext<CommerceContext>({} as CommerceContext);

export default function CommerceClientProvider({
    children,
    context,
}: PropsWithChildren<{ context: CommerceContext }>): ReactElement {
    return <CommerceClientContext.Provider value={context}>{children}</CommerceClientContext.Provider>;
}
