import { Category, ItemAction, ProductDetails } from "types/inventory";
import { SKUForm } from "types/sku";
import { User } from "types/user";

export const defaultProduct: ProductDetails = {
  name: "",
  description: "",
  partNumber: "",
  images: [],
  price: undefined,
  quantityRemaining: 0,
  status: "available",
  uniqueCode: "",
  quantitySold: 0,
  sku: "",
  tags: [],
  createdAt: new Date(),
  brand: "",
  quantityThreshold: 1,
};

export const defaultVariant: any = {
  name: "",
  partNumber: "",
  price: undefined,
  quantityRemaining: 0,
  sku: "",
  tags: [],
  images: [],
  quantityThreshold: 1,
};

export const defaultUser: User = {
  name: "",
  password: "",
  role: "",
  customRole: "",
  username: "",
};

export const defaultCategory: Category = {
  name: "",
  description: "",
};

export const defaultTransactionsColumns = {
  invoice_id: true,
  view: true,
  customer: true,
  quantity: true,
  amount: true,
  payment_method: true,
  date: true,
  status: true,
  sales_person: true,
  actions: true,
};

export const defaultInventoryColumns = {
  view: true,
  partNumber: true,
  name: true,
  price: true,
  remaining: true,
  sold: true,
  status: true,
  actions: true,
};

export const defaultSKUForm: SKUForm = {
  fields: ["", "", ""],
  saved: false,
};

export const itemActionOptions: ItemAction[] = ["edit", "duplicate", "delete"];
