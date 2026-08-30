import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@threadsofgold/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@threadsofgold/ui/components/empty";

export default function ProductNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[60svh] w-full max-w-[90rem] items-center px-5 py-16 sm:px-8 lg:px-12">
        <Empty className="min-h-80 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle className="text-2xl">Piece not found</EmptyTitle>
            <EmptyDescription>
              This piece is not part of the current preview collection.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/shop">Explore the collection</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </main>
      <SiteFooter />
    </>
  );
}
