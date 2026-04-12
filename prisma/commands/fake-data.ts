import { faker } from "@faker-js/faker";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

function randomDayOfMonth(date: Date | null): Date {
  if (!date) {
    return new Date();
  }
  const day = faker.number.int({ min: 1, max: 28 });
  return dayjs(date).set("date", day).toDate();
}

async function run() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email:
          user.email === "admin@yopmail.fr"
            ? user.email
            : faker.internet.email(),
        createdAt: randomDayOfMonth(user.createdAt),
        updatedAt: randomDayOfMonth(user.updatedAt),
      },
    });
  }

  const clients = await prisma.client.findMany();
  for (let index = 0; index < clients.length; index++) {
    await prisma.client.update({
      where: { id: clients[index].id },
      data: {
        name: faker.animal.cat() + index,
        address: faker.lorem.words(2),
        ape: faker.number.int(100000).toString(),
        email: faker.person.firstName() + "@yopmail.fr",
        siren: faker.string.alpha(),
        nif: faker.string.alpha(),
        phone: faker.phone.number(),
        createdAt: randomDayOfMonth(clients[index].createdAt),
        updatedAt: randomDayOfMonth(clients[index].updatedAt),
      },
    });
  }

  const providers = await prisma.provider.findMany();
  for (const provider of providers) {
    await prisma.provider.update({
      where: { id: provider.id },
      data: {
        address: faker.lorem.words(2),
        ape: faker.number.int(100000).toString(),
        email: faker.person.firstName() + "@yopmail.fr",
        name: faker.person.fullName(),
        siren: faker.string.alpha(),
        nif: faker.string.alpha(),
        phone: faker.phone.number(),
        createdAt: randomDayOfMonth(provider.createdAt),
        updatedAt: randomDayOfMonth(provider.updatedAt),
      },
    });
  }

  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: faker.commerce.product(),
        price: +faker.commerce.price(),
        createdAt: randomDayOfMonth(product.createdAt),
        updatedAt: randomDayOfMonth(product.updatedAt),
      },
    });
  }

  const paymentsInfo = await prisma.paymentMode.findMany();
  for (const payment of paymentsInfo) {
    await prisma.paymentMode.update({
      where: { id: payment.id },
      data: {
        accountName: faker.animal.crocodilia(),
        iban: faker.string.alphanumeric(),
        name: faker.commerce.department(),
        createdAt: randomDayOfMonth(payment.createdAt),
        updatedAt: randomDayOfMonth(payment.updatedAt),
      },
    });
  }

  console.log("Success !!");
}

run();
