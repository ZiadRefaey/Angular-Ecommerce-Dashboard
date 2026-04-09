import { Category, CategoryListItem } from '../models/categories.model';
import { Product } from '../../products/models/products.model';

function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

function resolveCategoryKey(category: Category): string {
  return category._id || normalizeCategoryName(category.name);
}

export function buildCategoryListItems(
  categories: Category[],
  products: Product[],
): CategoryListItem[] {
  const uniqueCategories = new Map<string, Category>();

  categories.forEach((category) => {
    const key = resolveCategoryKey(category);

    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, category);
    }
  });

  const productsCountByCategoryId = products.reduce<Record<string, number>>((accumulator, product) => {
    accumulator[product.category] = (accumulator[product.category] ?? 0) + 1;
    return accumulator;
  }, {});

  return [...uniqueCategories.values()]
    .map((category) => ({
      id: category._id || normalizeCategoryName(category.name),
      name: category.name,
      productsCount: productsCountByCategoryId[category._id] ?? 0,
      createdAt: category.createdAt ?? '',
    }))
    .sort((first, second) => first.name.localeCompare(second.name));
}
