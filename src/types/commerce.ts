export type ProductStatus =
  "Preorder" | "Made to order" | "Bespoke" | "Limited piece";

export type ProductCategory = "Tops" | "Menswear";

export type ProductSort =
  "featured" | "name-ascending" | "price-ascending" | "price-descending";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductOptionValue {
  id: string;
  label: string;
  swatch?: string;
}

export interface ProductOption {
  id: "size" | "colour" | "fabric" | "style";
  label: string;
  values: readonly ProductOptionValue[];
}

export interface ProductInformationSection {
  id: "story" | "materials" | "care" | "production";
  title: string;
  content: string;
}

export type ProductSelection = Readonly<Record<string, string>>;

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  samplePriceGhs: number;
  status: ProductStatus;
  image: ProductImage;
  gallery: readonly ProductImage[];
  featured: boolean;
  options: readonly ProductOption[];
  details: readonly string[];
  productionNote: string;
  timelineLabel: string;
  information: readonly ProductInformationSection[];
}

export type ProductPreview = Product;

export interface CartLine {
  id: string;
  product: ProductPreview;
  selections: ProductSelection;
  quantity: number;
}
