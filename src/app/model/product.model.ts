import {Category} from './category.model';

export interface Product {
  id?: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  category: Category;
}
