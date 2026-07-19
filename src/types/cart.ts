export interface CartItem {
  productId: string;
  variantLabel?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
