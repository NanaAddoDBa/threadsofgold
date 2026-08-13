import { homeContent } from "@/content/home";

export function CategoryIndexSection() {
  return (
    <section className="border-y bg-secondary py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div className="flex max-w-xl flex-col gap-4">
          <h2 className="text-balance font-heading text-5xl leading-none font-medium tracking-[-0.025em]">
            {homeContent.categoryIndex.title}
          </h2>
          <p className="text-pretty leading-7 text-muted-foreground">
            {homeContent.categoryIndex.description}
          </p>
        </div>
        <ol className="grid border-t sm:grid-cols-2">
          {homeContent.categoryIndex.items.map((category, index) => (
            <li
              key={category}
              className="flex items-center justify-between gap-4 border-b py-5 sm:px-5 sm:nth-[odd]:border-r"
            >
              <span className="font-heading text-2xl">{category}</span>
              <span className="text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
