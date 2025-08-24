import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import { getCommerceApiToken } from '../../utils/api/commerce-api';
import { fetchProductsGetCategory } from '../../utils/api/commerce-client.server';

/**
 * Resource route to provide e.g. the navigation menu with server-retrieved categories data.
 */
export async function loader({
    request,
    params
}: LoaderFunctionArgs): Promise<ShopperProductsTypes.Category> {
    const { categoryId = '' } = params;
    const [session] = await getCommerceApiToken(request);
    return fetchProductsGetCategory(session.data, {
        id: categoryId,
        levels: 2
    });
}
