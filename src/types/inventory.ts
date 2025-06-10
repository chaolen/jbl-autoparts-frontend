type ProductImages = {
  file: any;
  url: string;
};

export type ProductDetails = {
  _id?: string;
  name: string;
  brand: string;
  description: string;
  images: string[] | ProductImages[];
  uniqueCode: string;
  price?: number;
  quantityRemaining: number;
  quantitySold: number;
  partNumber: string;
  status: string;
  sku: string;
  tags: string[];
  createdAt: any;
  variants?: ProductDetails[];
  parentId?: string;
  quantityThreshold?: number;
};

export type Category = {
  name: string;
  description: string;
};

export type ItemAction = "edit" | "duplicate" | "delete";
