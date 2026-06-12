export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: 'poulets' | 'oeufs' | 'aliments' | 'autres';
  image: string;
  seller: string;
  location: string;
  available: boolean;
  stock: number;
}

export const categories = [
  { id: 'poulets', name: 'Poulets', icon: '🐔', description: 'Poulets de chair et pondeuses' },
  { id: 'oeufs', name: 'Œufs', icon: '🥚', description: 'Œufs frais du jour' },
  { id: 'aliments', name: 'Aliments', icon: '🌾', description: 'Aliments pour volaille et bétail' },
  { id: 'autres', name: 'Autres produits', icon: '🌿', description: 'Légumes, céréales et plus' },
];

export const products: Product[] = [];
