import { ProductDetails } from "./inventory";

export interface CartItem extends ProductDetails {
  count?: number;
}