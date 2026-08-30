"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { SearchIcon, SearchXIcon } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type {
  ProductCategory,
  ProductPreview,
  ProductSort,
} from "@/types/commerce";

type CategoryFilter = "all" | Lowercase<ProductCategory>;

const categoryOptions = [
  { value: "all", label: "All pieces" },
  { value: "tops", label: "Tops" },
  { value: "menswear", label: "Menswear" },
] as const satisfies readonly {
  value: CategoryFilter;
  label: string;
}[];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name-ascending", label: "Name: A to Z" },
  { value: "price-ascending", label: "Price: low to high" },
  { value: "price-descending", label: "Price: high to low" },
] as const satisfies readonly { value: ProductSort; label: string }[];

interface ProductCatalogueProps {
  products: readonly ProductPreview[];
  initialCategory?: CategoryFilter;
}

function sortProducts(
  products: ProductPreview[],
  sort: ProductSort,
): ProductPreview[] {
  if (sort === "name-ascending") {
    return products.toSorted((first, second) =>
      first.name.localeCompare(second.name),
    );
  }

  if (sort === "price-ascending") {
    return products.toSorted(
      (first, second) => first.samplePriceGhs - second.samplePriceGhs,
    );
  }

  if (sort === "price-descending") {
    return products.toSorted(
      (first, second) => second.samplePriceGhs - first.samplePriceGhs,
    );
  }

  return products;
}

export function ProductCatalogue({
  products,
  initialCategory = "all",
}: ProductCatalogueProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [sort, setSort] = useState<ProductSort>("featured");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category.toLowerCase() === category;
      const searchableContent = [
        product.name,
        product.subtitle,
        product.category,
        product.status,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return (
        matchesCategory &&
        (normalizedQuery.length === 0 ||
          searchableContent.includes(normalizedQuery))
      );
    });

    return sortProducts([...filteredProducts], sort);
  }, [category, deferredQuery, products, sort]);

  const resultLabel = `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;

  function resetDiscovery(): void {
    setQuery("");
    setCategory("all");
    setSort("featured");
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 border-y py-6 lg:grid-cols-[minmax(16rem,1.15fr)_auto_minmax(16rem,0.85fr)] lg:items-center">
        <InputGroup className="h-12 rounded-none bg-card">
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="px-4 text-base md:text-base"
          />
          <InputGroupAddon className="pl-4">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>

        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(value) => {
            if (value) {
              setCategory(value as CategoryFilter);
            }
          }}
          aria-label="Filter products by category"
          className="w-full justify-start overflow-x-auto rounded-none lg:justify-center"
        >
          {categoryOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              aria-label={`Show ${option.label.toLowerCase()}`}
              className="h-11 rounded-none px-5 font-heading text-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
          <label
            htmlFor="catalogue-sort"
            className="text-sm text-muted-foreground"
          >
            Sort by
          </label>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as ProductSort)}
          >
            <SelectTrigger
              id="catalogue-sort"
              className="h-11 min-w-44 rounded-none bg-card"
              aria-label="Sort products"
            >
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectGroup>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="min-w-16 text-right text-sm" aria-live="polite">
            {resultLabel}
          </p>
        </div>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              presentation="framed"
            />
          ))}
        </div>
      ) : (
        <Empty className="min-h-80 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle className="text-2xl">No pieces found</EmptyTitle>
            <EmptyDescription>
              Try another search or return to the complete preview collection.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" onClick={resetDiscovery}>
              Reset search and filters
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
