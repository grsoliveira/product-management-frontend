import {Category} from './category.model';

export interface ProductToList {
  id?: number;
  name: string;
  description: string;
  available: boolean;
  price: number;
  category: string;
}
