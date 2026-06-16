import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Getting Started",
    questions: [
      {
        question: "Is Flow Board free to use?",
        answer:
          "Yes! Flow Board has a generous free plan that includes unlimited members, up to 2 teams, and 500 cards. No credit card required.",
      },
      {
        question: "How is Flow Board different from Trello or Jira?",
        answer:
          "Flow Board is designed to be lightweight and fast. No bloated features, no steep learning curve — just boards, lists, and cards that work for your team out of the box.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No installation needed. Flow Board runs entirely in your browser. Just sign up and start building your first board in minutes.",
      },
    ],
  },
  {
    title: "Your Account",
    questions: [
      {
        question: "Can I invite my whole team for free?",
        answer:
          "Yes. All plans including the free tier support unlimited team members. Invite as many people as you need.",
      },
      {
        question: "What happens to my data if I cancel?",
        answer:
          "Your data remains accessible for 30 days after cancellation, giving you time to export everything you need.",
      },
    ],
  },
  {
    title: "Beta Program",
    questions: [
      {
        question: "Is Flow Board in beta?",
        answer:
          "Yes, Flow Board is currently in beta. You may encounter bugs or incomplete features. We're actively improving the product and appreciate your feedback.",
      },
      {
        question: "How do I report a bug or suggest a feature?",
        answer:
          "You can reach us through the Contact page or email us directly. We read every message and use your feedback to shape the roadmap.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              If you can't find what you're looking for,{" "}
              <Link href="/contact" className="underline underline-offset-4">
                get in touch
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
