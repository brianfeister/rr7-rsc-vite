import type { ReactElement } from 'react';
import { getServerContext } from '../../utils/server-context';
import { CommerceServerContext } from '../../providers/commerce.server';
import { fetchProductsGetCategory } from '../../utils/api/commerce-client.server';
import CategoryStoreProvider from '../../providers/category-store';
import NavigationDesktopClient from './desktop.client';

/**
 * This navigation component fetches root categories with 1 level of depth on the server,
 * providing immediate access to first-level subcategories. Deeper subcategory levels
 * are fetched on-demand client-side when hovering over categories. This approach needs to
 * be enhanced in order to add some light-weight client-side state management.
 *
 * This optimized approach:
 * - Minimizes server-side data fetching (only essential navigation structure)
 * - Enables on-demand loading for deeper category trees
 * - Uses `commerce-sdk-isomorphic` for both server and client-side calls
 * - Eliminates heavy-weight third-party dependencies, e.g. react-query
 */
export default async function NavigationDesktop(): Promise<ReactElement> {
    const context = getServerContext(CommerceServerContext);
    if (!context?.session) {
        throw new Error('Unexpected State: No commerce context provided.');
    }

    // Fetch root categories with first level of subcategories (levels: 1)
    const category = await fetchProductsGetCategory(context.session, {
        id: 'root',
        levels: 1
    });

    return (
        <CategoryStoreProvider>
            <NavigationDesktopClient category={category} />
        </CategoryStoreProvider>
    );
}
