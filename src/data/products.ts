import type { Product } from "@/types/commerce";

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
    gallery: [
      {
        src: "/images/products/independence-mesh-tee.jpeg",
        alt: "Full view of the red, gold, and green Threads of Gold graphic mesh top",
        width: 896,
        height: 1195,
      },
      {
        src: "/images/products/ghana-capsule-duo.jpeg",
        alt: "The Threads of Gold mesh tops presented together on a clothing rail",
        width: 945,
        height: 1107,
      },
    ],
    featured: true,
    options: [
      {
        id: "size",
        label: "Size",
        values: ["S", "M", "L", "XL"].map((label) => ({
          id: label.toLowerCase(),
          label,
        })),
      },
      {
        id: "colour",
        label: "Colour",
        values: [
          { id: "heritage-red", label: "Heritage red", swatch: "#8f1824" },
          { id: "golden-hour", label: "Golden hour", swatch: "#d7a11e" },
        ],
      },
    ],
    details: [
      "Distinctive graphic mesh",
      "Designed in Ghana",
      "Preorder piece",
    ],
    productionNote:
      "This is a preorder piece. Once the preorder window closes, your piece will be produced with care before fulfilment.",
    timelineLabel: "Timeline to be confirmed",
    information: [
      {
        id: "story",
        title: "The piece",
        content:
          "A confident graphic mesh top shaped by Ghana-inspired colour and the expressive TOG identity.",
      },
      {
        id: "materials",
        title: "Fabric and finish",
        content:
          "Fabric composition and finishing details are prototype content and will be confirmed by Threads of Gold before launch.",
      },
      {
        id: "care",
        title: "Care",
        content:
          "Final care instructions will be supplied with the confirmed fabric specification before orders open.",
      },
      {
        id: "production",
        title: "Preorder and production",
        content:
          "This preview represents a preorder workflow. Production timing, delivery and fulfilment rules remain to be confirmed.",
      },
    ],
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
    gallery: [
      {
        src: "/images/products/golden-hour-mesh-tee.jpeg",
        alt: "Full view of the gold, red, and green Threads of Gold graphic mesh top",
        width: 923,
        height: 1152,
      },
      {
        src: "/images/products/ghana-capsule-duo.jpeg",
        alt: "The Threads of Gold mesh tops presented together on a clothing rail",
        width: 945,
        height: 1107,
      },
    ],
    featured: true,
    options: [
      {
        id: "size",
        label: "Size",
        values: ["S", "M", "L", "XL"].map((label) => ({
          id: label.toLowerCase(),
          label,
        })),
      },
      {
        id: "colour",
        label: "Colour",
        values: [
          { id: "golden-hour", label: "Golden hour", swatch: "#d7a11e" },
          { id: "heritage-red", label: "Heritage red", swatch: "#8f1824" },
        ],
      },
    ],
    details: [
      "Distinctive graphic mesh",
      "Designed in Ghana",
      "Preorder piece",
    ],
    productionNote:
      "This is a preorder piece. Once the preorder window closes, your piece will be produced with care before fulfilment.",
    timelineLabel: "Timeline to be confirmed",
    information: [
      {
        id: "story",
        title: "The piece",
        content:
          "A vibrant colour-led interpretation of the TOG mesh top, designed for bold individual expression.",
      },
      {
        id: "materials",
        title: "Fabric and finish",
        content:
          "Fabric composition and finishing details are prototype content and will be confirmed by Threads of Gold before launch.",
      },
      {
        id: "care",
        title: "Care",
        content:
          "Final care instructions will be supplied with the confirmed fabric specification before orders open.",
      },
      {
        id: "production",
        title: "Preorder and production",
        content:
          "This preview represents a preorder workflow. Production timing, delivery and fulfilment rules remain to be confirmed.",
      },
    ],
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
    gallery: [
      {
        src: "/images/products/studio-patchwork-shirt.jpeg",
        alt: "Full view of the black Threads of Gold patchwork statement shirt",
        width: 912,
        height: 1183,
      },
      {
        src: "/images/products/tog-jersey-lineup.jpeg",
        alt: "Threads of Gold statement pieces presented together on a clothing rail",
        width: 1012,
        height: 1012,
      },
    ],
    featured: true,
    options: [
      {
        id: "size",
        label: "Size",
        values: ["S", "M", "L", "XL"].map((label) => ({
          id: label.toLowerCase(),
          label,
        })),
      },
      {
        id: "style",
        label: "Style",
        values: [
          { id: "signature", label: "Signature shape" },
          { id: "bespoke", label: "Bespoke enquiry" },
        ],
      },
    ],
    details: [
      "Sculptural patchwork panels",
      "Designed in Ghana",
      "Limited piece",
    ],
    productionNote:
      "This limited piece is presented as a prototype. Final availability and production timing will be confirmed before launch.",
    timelineLabel: "Timeline to be confirmed",
    information: [
      {
        id: "story",
        title: "The piece",
        content:
          "An asymmetric statement shirt that brings sculptural patchwork and Ghana-inspired colour into a distinctive TOG silhouette.",
      },
      {
        id: "materials",
        title: "Fabric and finish",
        content:
          "The final fabric, panel construction and finishing specification remain to be confirmed for production.",
      },
      {
        id: "care",
        title: "Care",
        content:
          "Final specialist care guidance will be confirmed with the production fabric and trim specification.",
      },
      {
        id: "production",
        title: "Limited-piece production",
        content:
          "Availability is illustrative. Quantity, bespoke eligibility and production timing will be agreed before this piece becomes purchasable.",
      },
    ],
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
    gallery: [
      {
        src: "/images/products/gold-crest-zip-shirt.jpeg",
        alt: "Full view of the black Threads of Gold zip-front embroidered shirt",
        width: 1067,
        height: 992,
      },
      {
        src: "/images/products/tog-jersey-lineup.jpeg",
        alt: "Threads of Gold statement pieces presented together on a clothing rail",
        width: 1012,
        height: 1012,
      },
    ],
    featured: true,
    options: [
      {
        id: "size",
        label: "Size",
        values: ["S", "M", "L", "XL"].map((label) => ({
          id: label.toLowerCase(),
          label,
        })),
      },
      {
        id: "fabric",
        label: "Fabric",
        values: [
          { id: "house-selection", label: "House selection" },
          { id: "client-sourced", label: "Client-sourced fabric" },
        ],
      },
    ],
    details: [
      "Embroidered crest detail",
      "Designed in Ghana",
      "Made-to-order piece",
    ],
    productionNote:
      "This piece will be made to order. Final measurements and production timing will be confirmed before launch.",
    timelineLabel: "Timeline to be confirmed",
    information: [
      {
        id: "story",
        title: "The piece",
        content:
          "A refined zip-front shirt with a clean black silhouette, gold TOG identity and embroidered Ghana-inspired detail.",
      },
      {
        id: "materials",
        title: "Fabric and finish",
        content:
          "Fabric choice, embroidery specification and internal finishing are prototype details awaiting production confirmation.",
      },
      {
        id: "care",
        title: "Care",
        content:
          "Final care guidance will be confirmed for the selected fabric and embroidery before orders open.",
      },
      {
        id: "production",
        title: "Made-to-order production",
        content:
          "Measurements, fabric confirmation, production timing and fulfilment will be agreed before the order is accepted.",
      },
    ],
  },
] as const satisfies readonly Product[];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}

export function getProductBySlug(productSlug: string): Product | undefined {
  return products.find((product) => product.slug === productSlug);
}
