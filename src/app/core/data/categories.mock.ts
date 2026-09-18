import { Category } from '../models/store.models';

/**
 * Categorias mockadas — estrutura idêntica ao contrato futuro da API.
 * Substituir por chamadas HTTP quando o backend estiver pronto.
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Camisetas',
    slug: 'camisetas',
    description: 'Camisetas premium com tecidos selecionados.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  },
  {
    id: 'cat-2',
    name: 'Calças',
    slug: 'calcas',
    description: 'Calças com corte moderno e caimento perfeito.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
  },
  {
    id: 'cat-3',
    name: 'Jaquetas',
    slug: 'jaquetas',
    description: 'Jaquetas para todas as estações.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  },
  {
    id: 'cat-4',
    name: 'Shorts',
    slug: 'shorts',
    description: 'Shorts confortáveis para o dia a dia.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80',
  },
  {
    id: 'cat-5',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Acessórios que complementam seu estilo.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
  },
];
