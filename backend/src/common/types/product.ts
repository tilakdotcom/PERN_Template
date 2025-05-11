export type ProductType = {
  _id: number;
  _base: string;
  reviews: number;
  rating: number;
  quantity: number;
  overView: string;
  name: string;
  isStock: boolean;
  isNew: boolean;
  images: string[];
  discountedPrice: number;
  regularPrice: number;
  description: string;
  colors: string[];
  category: string;
  brand: string;
};
