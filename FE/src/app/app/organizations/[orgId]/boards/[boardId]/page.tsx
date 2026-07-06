import { BoardPage } from "@/components/app/organization-workspace";

export default async function Board({
  params,
}: {
  params: Promise<{ orgId: string; boardId: string }>;
}) {
  const { orgId, boardId } = await params;

  return <BoardPage orgId={orgId} boardId={boardId} />;
}
