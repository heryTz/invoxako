import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/app/(dashboard)/invoice/index/invoice-service";
import { createClient } from "@/app/(dashboard)/invoice/client/client-service";
import { createProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { createPaymentMode } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import dayjs from "dayjs";

const EMAIL = "test.invoxako@yopmail.fr";
const CURRENCY = "EUR";
const INVOICE_COUNT = 100;

async function run() {
  let user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: EMAIL, emailVerified: true },
    });
    console.log(`Created user: ${EMAIL}`);
  } else {
    console.log(`User already exists: ${EMAIL}`);
  }

  const paymentMode =
    (await prisma.paymentMode.findFirst({
      where: { name: "Virement bancaire", onwerId: user.id },
    })) ?? (await createPaymentMode(user.id, { name: "Virement bancaire" }));

  console.log(`Creating ${INVOICE_COUNT} invoices…`);
  for (let i = 0; i < INVOICE_COUNT; i++) {
    const client = await createClient(user.id, {
      name: faker.company.name(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
    });
    const provider = await createProvider(user.id, {
      name: faker.company.name(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
    });
    const productCount = faker.number.int({ min: 1, max: 5 });
    const products = Array.from({ length: productCount }, () => ({
      name: faker.commerce.productName(),
      price: +faker.commerce.price({ min: 50, max: 5000 }),
      qte: faker.number.int({ min: 1, max: 10 }),
    }));
    const createdAt = dayjs()
      .subtract(faker.number.int({ min: 0, max: 730 }), "day")
      .toDate();
    await createInvoice(user.id, {
      clientId: client.id,
      providerId: provider.id,
      paymentModeId: paymentMode.id,
      currency: CURRENCY,
      tva: faker.helpers.arrayElement([0, 5, 10, 20]),
      products,
      createdAt,
    });
    if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${INVOICE_COUNT}`);
  }

  console.log("Done!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
