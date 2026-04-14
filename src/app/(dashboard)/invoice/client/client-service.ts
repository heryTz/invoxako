import { prisma } from "@/lib/prisma";
import { SaveClientInput } from "./client-dto";
import { NotFoundError } from "@/lib/exception";

export async function getClients(userId: string) {
  const clients = await prisma.client.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
  });
  return {
    results: clients,
  };
}

export type GetClients = Awaited<ReturnType<typeof getClients>>;

export async function getClientById(userId: string, id: string) {
  const client = await prisma.client.findFirst({
    where: { id, ownerId: userId },
  });
  if (!client) throw new NotFoundError();
  return client;
}

export type GetClientById = Awaited<ReturnType<typeof getClientById>>;

export async function createClient(userId: string, input: SaveClientInput) {
  const { clientSeq } = await prisma.user.update({
    where: { id: userId },
    data: { clientSeq: { increment: 1 } },
    select: { clientSeq: true },
  });
  const client = await prisma.client.create({
    data: {
      ...input,
      ref: `C${String(clientSeq).padStart(3, "0")}`,
      ownerId: userId,
    },
  });
  return client;
}

export type CreateClient = Awaited<ReturnType<typeof createClient>>;

export async function updateClient(
  userId: string,
  id: string,
  input: SaveClientInput,
) {
  const client = await prisma.client.update({
    where: { id, ownerId: userId },
    data: input,
  });
  return client;
}

export type UpdateClient = Awaited<ReturnType<typeof updateClient>>;

export async function deleteClient(userId: string, id: string) {
  const client = await prisma.client.delete({
    where: { id: id, ownerId: userId },
  });
  return client;
}

export type DeleteClient = Awaited<ReturnType<typeof deleteClient>>;
