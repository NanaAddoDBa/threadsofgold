export type ProductStatus =
  "Preorder" | "Made to order" | "Bespoke" | "Limited piece";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductPreview {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "Tops" | "Menswear";
  samplePriceGhs: number;
  status: ProductStatus;
  image: ProductImage;
  featured: boolean;
}

export interface CartLine {
  product: ProductPreview;
  quantity: number;
}
