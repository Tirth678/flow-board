import Link from "next/link";

import { ArrowRight, Building2, ClipboardList, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Create organizations",
    description: "Group teammates, projects, and permissions around real working teams.",
    icon: Building2,
  },
  {
    title: "Build boards",
    description: "Create focused boards for sprints, product work, operations, or daily to-dos.",
    icon: ClipboardList,
  },
  {
    title: "Invite members",
    description: "Add teammates by username and keep everyone working from the same source.",
    icon: Users,
  },
];

export default function AppHome() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-lg border bg-background p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">Flow Board app</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
            Run your team work from organizations, boards, and cards.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start by creating an organization, invite your team, then open a board
            to create cards and move them through the workflow.
          </p>
          <Button asChild className="mt-6">
            <Link href="/app/organizations">
              Open workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader>
                <Icon className="mb-2 size-5 text-muted-foreground" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1.5 rounded-full bg-primary" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
