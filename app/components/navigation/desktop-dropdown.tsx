'use client';

import {
    type JSX,
    type ReactElement,
    useEffect,
    useMemo,
    useState
} from 'react';
import { Link, type LoaderFunctionArgs, useFetcher } from 'react-router';
import type { ShopperProductsTypes } from 'commerce-sdk-isomorphic';
import { useShallow } from 'zustand/react/shallow';
import { useCategoryStore } from '../../providers/category-store';

const COLUMNS_MAX = 5;

const CategoryLinks = ({
    category
}: {
    category: ShopperProductsTypes.Category;
}): ReactElement => {
    const { id, name, categories: subCategories } = category;

    const categoryLink = {
        href: `/category/${id}`,
        text: name,
        className: 'text-md mb-2 font-bold'
    };

    const subCategoryLinks = subCategories
        ? subCategories
              .filter((sub) => sub.c_showInMenu)
              .map((subCategory) => ({
                  href: `/category/${subCategory.id}`,
                  text: subCategory.name,
                  className:
                      'text-md py-3 text-foreground/80 hover:text-foreground'
              }))
        : [];

    return (
        <div className="min-w-0 flex-[0_0_21%]">
            <Link
                to={categoryLink.href}
                className={`block ${categoryLink.className}`}
            >
                {categoryLink.text}
            </Link>

            {subCategoryLinks.map((link) => (
                <Link
                    key={link.href}
                    to={link.href}
                    className={`block ${link.className} hover:no-underline`}
                >
                    {link.text}
                </Link>
            ))}
        </div>
    );
};

const LoadingIndicator = (): ReactElement => (
    <div className="min-w-0 flex-[0_0_21%] animate-pulse">
        <div className="h-5 bg-muted rounded mb-2" />
        <div className="space-y-3">
            <div className="h-4 bg-muted/50 rounded" />
            <div className="h-4 bg-muted/50 rounded" />
            <div className="h-4 bg-muted/50 rounded" />
        </div>
    </div>
);

export default function NavigationDesktopDropdown({
    category
}: {
    category: ShopperProductsTypes.Category;
}): JSX.Element | null {
    const { categories, updateCategory } = useCategoryStore(
        useShallow((state) => ({
            categories: state.categories,
            updateCategory: state.updateCategory
        }))
    );

    const fetcher =
        useFetcher<
            (args: LoaderFunctionArgs) => Promise<ShopperProductsTypes.Category>
        >();
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Fetch subcategories for the hovered/active category, if applicable (`onlineSubCategoriesCount` > 0)
        if (
            category?.onlineSubCategoriesCount > 0 &&
            !categories[category.id] &&
            !loaded[category.id]
        ) {
            setLoaded((prevState) => ({
                ...prevState,
                [category.id]: true
            }));
            fetcher.load(`/resource/category/${category.id}`);
        }
    }, [category, categories, fetcher, loaded]);

    useEffect(() => {
        if (fetcher.data && !categories[fetcher.data.id]) {
            // Finished loading data --> Put the retrieved data in the navigation store
            // Note: This is using `fetcher.data.id` instead of `categoryId` on purpose. When the user switches between
            // the navigation dropdowns while the fetcher for another dropdown instance is still running, this ensures
            // keeping the data of that request.
            updateCategory(fetcher.data.id, fetcher.data);
        }
    }, [fetcher.data, categories, updateCategory]);

    const { subCategories, columnsToShow } = useMemo(() => {
        // Filter categories that should show up in menu
        const subCategories = (
            categories[category.id]?.categories ?? []
        ).filter((c: ShopperProductsTypes.Category) => c.c_showInMenu);
        return {
            subCategories,
            columnsToShow: Math.min(
                category.onlineSubCategoriesCount,
                COLUMNS_MAX
            )
        };
    }, [category, categories]);

    if (category.onlineSubCategoriesCount === 0) {
        return null;
    }
    return (
        <div
            className="grid gap-8 justify-start ml-[68px] xl:ml-24"
            style={{
                gridTemplateColumns: `repeat(${Math.max(
                    columnsToShow,
                    2
                )}, minmax(0, 21%))`
            }}
        >
            {subCategories.length
                ? // Show actual subcategories
                  subCategories.map(
                      (subCategory: ShopperProductsTypes.Category) => (
                          <CategoryLinks
                              key={subCategory.id}
                              category={subCategory}
                          />
                      )
                  )
                : // Show loading placeholders
                  Array.from({ length: Math.max(columnsToShow, 2) }).map(
                      (_, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <LoadingIndicator key={`loading-${index}`} />
                      )
                  )}
        </div>
    );
}
