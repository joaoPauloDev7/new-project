import { Injectable, signal, computed } from '@angular/core';
import { Product, Category } from '../models/store.models';
import { MOCK_PRODUCTS } from '../data/products.mock';
import { MOCK_CATEGORIES } from '../data/categories.mock';

/**
 * Serviço da loja pública — fonte de dados de produtos e categorias.
 *
 * Atualmente utiliza dados mockados.
 * Para integrar com o backend, substituir os métodos por chamadas HTTP
 * mantendo as mesmas assinaturas.
 */
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly productsData = signal<Product[]>(MOCK_PRODUCTS);
  private readonly categoriesData = signal<Category[]>(MOCK_CATEGORIES);

  /** Todos os produtos */
  readonly products = this.productsData.asReadonly();

  /** Todas as categorias */
  readonly categories = this.categoriesData.asReadonly();

  /** Produtos em destaque */
  readonly featuredProducts = computed(() =>
    this.productsData().filter((p) => p.featured && p.available)
  );

  /** Produtos novos */
  readonly newProducts = computed(() =>
    this.productsData().filter((p) => p.isNew && p.available)
  );

  /** Buscar produto por ID */
  getProductById(id: string): Product | undefined {
    return this.productsData().find((p) => p.id === id);
  }

  /** Buscar produto por slug */
  getProductBySlug(slug: string): Product | undefined {
    return this.productsData().find((p) => p.slug === slug);
  }

  /** Buscar categoria por ID */
  getCategoryById(id: string): Category | undefined {
    return this.categoriesData().find((c) => c.id === id);
  }

  /** Buscar categoria por slug */
  getCategoryBySlug(slug: string): Category | undefined {
    return this.categoriesData().find((c) => c.slug === slug);
  }

  /** Produtos por categoria */
  getProductsByCategory(categoryId: string): Product[] {
    return this.productsData().filter(
      (p) => p.categoryId === categoryId && p.available
    );
  }

  /** Buscar produtos por termo */
  searchProducts(query: string): Product[] {
    const term = query.toLowerCase().trim();
    if (!term) return this.productsData().filter((p) => p.available);

    return this.productsData().filter(
      (p) =>
        p.available &&
        (p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term))
    );
  }

  /** Filtrar produtos */
  filterProducts(filters: {
    categoryId?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc';
  }): Product[] {
    let result = this.productsData().filter((p) => p.available);

    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.size) {
      result = result.filter((p) => p.sizes?.includes(filters.size!));
    }

    if (filters.color) {
      result = result.filter((p) =>
        p.colors?.some((c) => c.name === filters.color)
      );
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(
        (p) => (p.promotionalPrice ?? p.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(
        (p) => (p.promotionalPrice ?? p.price) <= filters.maxPrice!
      );
    }

    if (filters.query) {
      const term = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort(
            (a, b) =>
              (a.promotionalPrice ?? a.price) - (b.promotionalPrice ?? b.price)
          );
          break;
        case 'price-desc':
          result.sort(
            (a, b) =>
              (b.promotionalPrice ?? b.price) - (a.promotionalPrice ?? a.price)
          );
          break;
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );
          break;
      }
    }

    return result;
  }
}
