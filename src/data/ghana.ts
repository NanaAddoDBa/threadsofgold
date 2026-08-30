export const ghanaRegions = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
] as const;

export const deliveryMethods = [
  {
    id: "accra-delivery",
    label: "Accra delivery (illustrative)",
    description: "A future delivery option for addresses within Accra.",
  },
  {
    id: "other-regions",
    label: "Other regions (illustrative)",
    description: "A future delivery option for addresses elsewhere in Ghana.",
  },
] as const;
