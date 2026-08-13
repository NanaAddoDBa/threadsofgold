import type { ProductPreview } from "@/types/commerce";

export const products = [
  {
    id: "tog-mesh-red",
    slug: "independence-mesh-tee",
    name: "Independence Mesh Tee",
    subtitle: "A bold red, gold, and green TOG statement top.",
    category: "Tops",
    samplePriceGhs: 720,
    status: "Preorder",
    image: {
      src: "/images/products/independence-mesh-tee.jpeg",
      alt: "Red, gold, and green Threads of Gold graphic mesh top",
      width: 896,
      height: 1195,
    },
    featured: true,
  },
  {
    id: "tog-mesh-gold",
    slug: "golden-hour-mesh-tee",
    name: "Golden Hour Mesh Tee",
    subtitle: "A gold-led colourway with red and green panels.",
    category: "Tops",
    samplePriceGhs: 720,
    status: "Preorder",
    image: {
      src: "/images/products/golden-hour-mesh-tee.jpeg",
      alt: "Gold, red, and green Threads of Gold graphic mesh top",
      width: 923,
      height: 1152,
    },
    featured: true,
  },
  {
    id: "tog-patchwork-shirt",
    slug: "studio-patchwork-shirt",
    name: "Studio Patchwork Shirt",
    subtitle: "An asymmetric black statement shirt with sculptural panels.",
    category: "Menswear",
    samplePriceGhs: 980,
    status: "Limited piece",
    image: {
      src: "/images/products/studio-patchwork-shirt.jpeg",
      alt: "Black Threads of Gold short-sleeve patchwork statement shirt",
      width: 912,
      height: 1183,
    },
    featured: true,
  },
  {
    id: "tog-crest-zip-shirt",
    slug: "gold-crest-zip-shirt",
    name: "Gold Crest Zip Shirt",
    subtitle: "A clean black zip shirt finished with embroidered detail.",
    category: "Menswear",
    samplePriceGhs: 1150,
    status: "Made to order",
    image: {
      src: "/images/products/gold-crest-zip-shirt.jpeg",
      alt: "Black Threads of Gold zip-front shirt with gold and multicolour embroidery",
      width: 1067,
      height: 992,
    },
    featured: true,
  },
] as const satisfies readonly ProductPreview[];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductById(productId: string): ProductPreview | undefined {
  return products.find((product) => product.id === productId);
}
