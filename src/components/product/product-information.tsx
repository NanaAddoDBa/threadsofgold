import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductInformationSection } from "@/types/commerce";

interface ProductInformationProps {
  sections: readonly ProductInformationSection[];
}

export function ProductInformation({ sections }: ProductInformationProps) {
  return (
    <Accordion type="multiple" defaultValue={["story"]} className="border-t">
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="font-heading text-xl font-medium hover:no-underline">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="max-w-xl text-sm leading-6 text-muted-foreground">
            {section.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
