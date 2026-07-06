"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Board, CardStatus, FlowCard, Organization, OrgMember, flowApi, getOrgId } from "@/lib/api";
import { cn } from "@/lib/utils";

type WorkspaceState = {
  organizations: Organization[];
  selectedOrgId: string;
  org?: Organization;
  members: OrgMember[];
  boards: Board[];
};

const columns: { status: CardStatus; title: string; tone: string }[] = [
  { status: "up_next", title: "Up next", tone: "border-chart-4/50 bg-chart-4/10" },
  { status: "in_progress", title: "In progress", tone: "border-chart-2/50 bg-chart-2/10" },
  { status: "done", title: "Done", tone: "border-chart-5/50 bg-chart-5/10" },
];

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-background p-8 text-center">
      <Icon className="mb-3 size-8 text-muted-foreground" />
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function OrganizationsPage() {
  const router = useRouter();
  const [state, setState] = useState<WorkspaceState>({
    organizations: [],
    selectedOrgId: "",
    members: [],
    boards: [],
  });
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (preferredOrgId?: string) => {
    if (!flowApi.token) {
      router.push("/login");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const orgResponse = await flowApi.listOrganizations();
      const organizations = orgResponse.orgs || [];
      const selectedOrgId = preferredOrgId || getOrgId(organizations[0] || {});
      let org = organizations.find((item) => getOrgId(item) === selectedOrgId);
      let members: OrgMember[] = [];
      let boards: Board[] = [];

      if (selectedOrgId) {
        const [orgDetail, membersResponse, boardsResponse] = await Promise.all([
          flowApi.getOrganization(selectedOrgId),
          flowApi.listMembers(selectedOrgId).catch(() => ({ members: [] })),
          flowApi.listBoards(selectedOrgId).catch(() => ({ boards: [] })),
        ]);
        org = orgDetail.org;
        members = membersResponse.members || [];
        boards = boardsResponse.boards || [];
      }

      setState({ organizations, selectedOrgId, org, members, boards });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workspace");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const createOrg = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving("org");
    setError("");
    try {
      const response = await flowApi.createOrganization({
        orgName,
        description: orgDescription,
      });
      setOrgName("");
      setOrgDescription("");
      await load(getOrgId(response.org));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create organization");
    } finally {
      setSaving("");
    }
  };

  const createBoard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.selectedOrgId) return;
    setSaving("board");
    setError("");
    try {
      await flowApi.createBoard(state.selectedOrgId, {
        name: boardName,
        description: boardDescription,
      });
      setBoardName("");
      setBoardDescription("");
      await load(state.selectedOrgId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create board");
    } finally {
      setSaving("");
    }
  };

  const inviteMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.selectedOrgId) return;
    setSaving("invite");
    setError("");
    try {
      await flowApi.inviteMember(state.selectedOrgId, inviteUsername);
      setInviteUsername("");
      await load(state.selectedOrgId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to invite member");
    } finally {
      setSaving("");
    }
  };

  const removeMember = async (member: OrgMember) => {
    if (!state.selectedOrgId) return;
    const userId = typeof member.userId === "string" ? member.userId : member.userId._id;
    setSaving(userId);
    try {
      await flowApi.removeMember(state.selectedOrgId, userId);
      await load(state.selectedOrgId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove member");
    } finally {
      setSaving("");
    }
  };

  const deleteBoard = async (boardId: string) => {
    setSaving(boardId);
    try {
      await flowApi.deleteBoard(boardId);
      await load(state.selectedOrgId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete board");
    } finally {
      setSaving("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Workspace</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Organizations and boards
          </h1>
        </div>
        {state.organizations.length > 0 ? (
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={state.selectedOrgId}
            onChange={(event) => load(event.target.value)}
          >
            {state.organizations.map((org) => (
              <option key={getOrgId(org)} value={getOrgId(org)}>
                {org.orgName}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {state.org ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="size-5" />
                    {state.org.orgName}
                  </CardTitle>
                  <CardDescription>{state.org.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-2xl font-semibold">{state.boards.length}</p>
                    <p className="text-sm text-muted-foreground">Boards</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-2xl font-semibold">{state.members.length}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-2xl font-semibold">3</p>
                    <p className="text-sm text-muted-foreground">Task stages</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                icon={Building2}
                title="Create your first organization"
                description="Organizations hold your team members and boards. Start here, then add boards for projects or workflows."
              />
            )}

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Boards</h2>
              </div>
              {state.boards.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {state.boards.map((board) => (
                    <Card key={board._id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>{board.name}</CardTitle>
                        <CardDescription>{board.description || "No description yet"}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Button asChild>
                          <Link href={`/app/organizations/${state.selectedOrgId}/boards/${board._id}`}>
                            Open board
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete board"
                          onClick={() => deleteBoard(board._id)}
                          disabled={saving === board._id}
                        >
                          {saving === board._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ClipboardList}
                  title="No boards yet"
                  description="Create a board for a sprint, department, product roadmap, or daily team to-do list."
                />
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create organization</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={createOrg}>
                  <Input
                    placeholder="Organization name"
                    value={orgName}
                    onChange={(event) => setOrgName(event.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="What does this team manage?"
                    value={orgDescription}
                    onChange={(event) => setOrgDescription(event.target.value)}
                    required
                  />
                  <Button className="w-full" disabled={saving === "org"}>
                    {saving === "org" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Create organization
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create board</CardTitle>
                <CardDescription>Boards belong to the selected organization.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={createBoard}>
                  <Input
                    placeholder="Board name"
                    value={boardName}
                    onChange={(event) => setBoardName(event.target.value)}
                    required
                    disabled={!state.selectedOrgId}
                  />
                  <Textarea
                    placeholder="Board description"
                    value={boardDescription}
                    onChange={(event) => setBoardDescription(event.target.value)}
                    disabled={!state.selectedOrgId}
                  />
                  <Button className="w-full" disabled={!state.selectedOrgId || saving === "board"}>
                    {saving === "board" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Create board
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-4" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="flex gap-2" onSubmit={inviteMember}>
                  <Input
                    placeholder="Username"
                    value={inviteUsername}
                    onChange={(event) => setInviteUsername(event.target.value)}
                    disabled={!state.selectedOrgId}
                  />
                  <Button size="icon" disabled={!state.selectedOrgId || saving === "invite"}>
                    {saving === "invite" ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                  </Button>
                </form>
                <div className="space-y-2">
                  {state.members.map((member) => {
                    const user =
                      typeof member.userId === "string"
                        ? { _id: member.userId, username: member.username || "Member", email: "" }
                        : member.userId;
                    return (
                      <div key={member._id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{user.username}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email || member.role}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeMember(member)}
                          disabled={saving === user._id}
                        >
                          {saving === user._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                  {!state.members.length ? (
                    <p className="text-sm text-muted-foreground">No members listed yet.</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

export function BoardPage({ boardId, orgId }: { boardId: string; orgId: string }) {
  const router = useRouter();
  const [cards, setCards] = useState<FlowCard[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  const board = useMemo(
    () => boards.find((item) => item._id === boardId),
    [boardId, boards],
  );

  const load = useCallback(async () => {
    if (!flowApi.token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [cardsResponse, boardsResponse] = await Promise.all([
        flowApi.listCards(boardId),
        flowApi.listBoards(orgId).catch(() => ({ boards: [] })),
      ]);
      setCards(cardsResponse.cards || []);
      setBoards(boardsResponse.boards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load board");
    } finally {
      setLoading(false);
    }
  }, [boardId, orgId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const createCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving("card");
    try {
      await flowApi.createCard(boardId, { title, description });
      setTitle("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create card");
    } finally {
      setSaving("");
    }
  };

  const updateStatus = async (cardId: string, status: CardStatus) => {
    setSaving(`${cardId}-${status}`);
    try {
      await flowApi.updateCardStatus(cardId, status);
      setCards((current) =>
        current.map((card) => (card._id === cardId ? { ...card, status } : card)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update card");
    } finally {
      setSaving("");
    }
  };

  const deleteCard = async (cardId: string) => {
    setSaving(cardId);
    try {
      await flowApi.deleteCard(cardId);
      setCards((current) => current.filter((card) => card._id !== cardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete card");
    } finally {
      setSaving("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link href="/app/organizations" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Organizations
          </Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {board?.name || "Board"}
          </h1>
          <p className="mt-1 text-muted-foreground">{board?.description || "Create and move team cards through the workflow."}</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <CheckCircle2 className="size-4 text-muted-foreground" />
          {cards.filter((card) => card.status === "done").length} completed
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card>
        <CardContent className="p-4">
          <form className="grid gap-3 lg:grid-cols-[1fr_2fr_auto]" onSubmit={createCard}>
            <Input
              placeholder="Card title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button disabled={saving === "card"}>
              {saving === "card" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add card
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnCards = cards.filter((card) => card.status === column.status);
            return (
              <section key={column.status} className="min-h-96 rounded-lg border bg-background">
                <div className={cn("flex items-center justify-between border-b px-4 py-3", column.tone)}>
                  <h2 className="font-display font-semibold">{column.title}</h2>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium">
                    {columnCards.length}
                  </span>
                </div>
                <div className="space-y-3 p-3">
                  {columnCards.map((card) => (
                    <article key={card._id} className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium">{card.title}</h3>
                          {card.description ? (
                            <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                          ) : null}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete card"
                          onClick={() => deleteCard(card._id)}
                          disabled={saving === card._id}
                        >
                          {saving === card._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-1">
                        {columns.map((target) => (
                          <Button
                            key={target.status}
                            type="button"
                            variant={target.status === card.status ? "default" : "outline"}
                            size="sm"
                            className="px-2 text-xs"
                            onClick={() => updateStatus(card._id, target.status)}
                            disabled={saving === `${card._id}-${target.status}`}
                          >
                            {target.title}
                          </Button>
                        ))}
                      </div>
                    </article>
                  ))}
                  {!columnCards.length ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      No cards here.
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
