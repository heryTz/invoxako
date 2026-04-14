import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseClientSeq(ref: string): number {
  // "C1" → 1, "C-001" → 1 (already migrated)
  const match = ref.match(/^C0*(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseInvoiceSeq(ref: string): number {
  // "C1-1" → 1, "C1-2" → 2
  const match = ref.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

function clientRef(seq: number): string {
  return `C${String(seq).padStart(3, "0")}`;
}

function invoiceRef(cRef: string, year: number, seq: number): string {
  return `${cRef}.${year}.${String(seq).padStart(3, "0")}`;
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });

  for (const user of users) {
    const clients = await prisma.client.findMany({
      where: { ownerId: user.id },
      select: { id: true, ref: true, invoiceSeq: true },
    });

    for (const client of clients) {
      const seq = parseClientSeq(client.ref);
      if (seq === 0) {
        console.warn(
          `  Skipping client ${client.id}: unrecognized ref "${client.ref}"`,
        );
        continue;
      }

      const newClientRef = clientRef(seq);
      if (newClientRef !== client.ref) {
        await prisma.client.update({
          where: { id: client.id },
          data: { ref: newClientRef },
        });
        console.log(
          `  Client ${client.id}: "${client.ref}" → "${newClientRef}"`,
        );
      } else {
        console.log(
          `  Client ${client.id}: already "${newClientRef}", skipping`,
        );
      }

      // Fix invoices for this client
      const invoices = await prisma.invoice.findMany({
        where: { clientId: client.id },
        select: { id: true, ref: true, createdAt: true },
      });

      for (const invoice of invoices) {
        const invoiceSeq = parseInvoiceSeq(invoice.ref);
        if (invoiceSeq === 0) {
          console.warn(
            `    Skipping invoice ${invoice.id}: unrecognized ref "${invoice.ref}"`,
          );
          continue;
        }

        const year = invoice.createdAt.getFullYear();
        const newInvoiceRef = invoiceRef(newClientRef, year, invoiceSeq);

        if (newInvoiceRef !== invoice.ref) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { ref: newInvoiceRef },
          });
          console.log(
            `    Invoice ${invoice.id}: "${invoice.ref}" → "${newInvoiceRef}"`,
          );
        } else {
          console.log(
            `    Invoice ${invoice.id}: already "${newInvoiceRef}", skipping`,
          );
        }
      }

      if (client.invoiceSeq === 0 && invoices.length > 0) {
        await prisma.client.update({
          where: { id: client.id },
          data: { invoiceSeq: invoices.length },
        });
        console.log(
          `  Client ${client.id}: invoiceSeq set to ${invoices.length}`,
        );
      }
    }

    const { clientSeq } = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { clientSeq: true },
    });

    if (clientSeq === 0 && clients.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { clientSeq: clients.length },
      });
      console.log(`User ${user.id}: clientSeq set to ${clients.length}`);
    }
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
