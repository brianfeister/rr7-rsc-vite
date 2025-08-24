import type { unstable_RSCRouteConfig as RSCRouteConfig } from 'react-router';

export function routes() {
    return [
        {
            id: 'root',
            path: '',
            lazy: () => import('./root_orig'),
            children: [
                {
                    id: 'home',
                    index: true,
                    lazy: () => import('./routes/home/index')
                },
                {
                    id: 'search',
                    path: 'search',
                    lazy: () => import('./routes/search/index')
                },
                {
                    id: 'category',
                    path: 'category/:categoryId',
                    lazy: () => import('./routes/category/index')
                },
                {
                    id: 'product',
                    path: 'product/:productId',
                    lazy: () => import('./routes/product/index')
                },
                {
                    id: 'product-add-to-cart',
                    path: 'product/add-to-cart',
                    lazy: () => import('./routes/product/add-to-cart')
                },
                {
                    id: 'product-add-set-to-cart',
                    path: 'product/add-set-to-cart',
                    lazy: () => import('./routes/product/add-set-to-cart')
                },
                {
                    id: 'product-add-bundle-to-cart',
                    path: 'product/add-bundle-to-cart',
                    lazy: () => import('./routes/product/add-bundle-to-cart')
                },
                {
                    id: 'cart',
                    path: 'cart',
                    lazy: () => import('./routes/cart/index')
                },
                {
                    id: 'resource-category',
                    path: 'resource/category/:categoryId',
                    lazy: () => import('./routes/resource/category')
                }
            ]
        }
    ] satisfies RSCRouteConfig;
}
