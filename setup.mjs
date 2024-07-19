import { ItemType, PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const { TIDB_USER, TIDB_PASSWORD, TIDB_HOST, TIDB_PORT, TIDB_DB_NAME = 'enullshop', DATABASE_URL } = process.env;
// Notice: When using TiDb Cloud Serverless Tier, you **MUST** set the following flags to enable tls connection.
const SSL_FLAGS = 'pool_timeout=60&sslaccept=accept_invalid_certs';
// TODO: When TiDB Cloud support return DATABASE_URL, we can remove it.
const databaseURL = DATABASE_URL
    ? `${DATABASE_URL}?${SSL_FLAGS}`
    : `mysql://${TIDB_USER}:${TIDB_PASSWORD}@${TIDB_HOST}:${TIDB_PORT}/${TIDB_DB_NAME}?${SSL_FLAGS}`;

const setup = async () => {
  let client;

  try {
    client = new PrismaClient({
      datasources: {
        db: {
          url: databaseURL
        }
      }
    });
    await client.$connect();

    const hasData = await client.user.count() > 0;

    if (hasData) {
      console.log('Database already exists with data');
      client.$disconnect();
      return;
    }

    // Seed data.
    const users = await seedUsers(client, 20);
    const sellers = await seedSellers(client, 20);
    const items = await seedItems(client, 100);
    await seedItemsAndSellers(client, items, sellers);
    await seedReviews(client, items, users);
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.$disconnect();
    }
  }
};

// Seed users data.
async function seedUsers(client, num) {
  const records = [...Array(num)].map((value, index) => {
    const id = index + 1;
    const username = faker.internet.userName();
    const balance = faker.random.numeric(6);

    return {
      id,
      username,
      balance
    };
  });

  const added = await client.user.createMany({
      data: records,
      skipDuplicates: true
  });

  if (added.count > 0) {
    console.log(`Successfully inserted ${added.count} user records.`);
  }

  return records;
}

// Seed sellers data.
async function seedSellers(client, num) {
  const records = [...Array(num)].map((value, index) => {
    const id = index + 1;
    const name = faker.name.fullName();
    const location = faker.address.city();
    const rating = faker.datatype.number({ min: 1, max: 5 });

    return {
      id,
      name,
      location,
      rating
    };
  });

  const added = await client.seller.createMany({
      data: records,
      skipDuplicates: true
  });

  if (added.count > 0) {
    console.log(`Successfully inserted ${added.count} seller records.`);
  }

  return records;
}

// Seed items data.
const itemTypes = Object.keys(ItemType);
async function seedItems(client, num) {
  const records = [...Array(num)].map((value, index) => {
    const id = index + 1;
    const name = faker.commerce.productName();
    const itemTypeIndex = faker.datatype.number({ min: 0, max: itemTypes.length - 1 });
    const type = itemTypes[itemTypeIndex];
    const createdAt = faker.date.between('2000-01-01T00:00:00.000Z', Date.now().toString());
    const stock = faker.datatype.number({ min: 0, max: 200 });
    const price = faker.datatype.number({ min: 0, max: 200, precision: 0.01 });

    return {
      id,
      name,
      type,
      createdAt,
      stock,
      price
    };
  });

  const added = await client.item.createMany({
      data: records,
      skipDuplicates: true
  });

  if (added.count > 0) {
    console.log(`Successfully inserted ${added.count} item records.`);
  }

  return records;
}

// Seed items and sellers data.
async function seedItemsAndSellers(client, items, sellers) {
  const records = items.map((item) => {
    const sellerIndex = faker.datatype.number({ min: 0, max: sellers.length - 1 });
    const seller = sellers[sellerIndex];

    return {
      itemId: item.id,
      sellerId: seller.id
    }
  });

  const added = await client.itemSeller.createMany({
    data: records,
    skipDuplicates: true
  });

  if (added.count > 0) {
    console.log(`Successfully inserted ${added.count} item and seller relation records.`);
  }

  return records;
}

// Seed reviews data.
async function seedReviews(client, items, users) {
  let total = 0;
  for (const item of items) {
    const reviewNum = faker.datatype.number({ min: 10, max: 30});
    const itemId = item.id;
    const records = [...Array(reviewNum)].map(() => {
      const rating = faker.datatype.number({ min: 1, max: 5 });
      const userIndex = faker.datatype.number({ min: 1, max: users.length - 1 });
      const userId = users[userIndex].id;
      const reviewedAt = faker.date.between(item.createdAt.toString(), Date.now().toString());

      return {
        userId,
        itemId,
        rating,
        reviewedAt
      }
    });

    const added = await client.review.createMany({
      data: records,
      skipDuplicates: true
    });

    total += added.count;
  }

  if (total > 0) {
    console.log(`Successfully inserted ${total} review records.`);
  }
}

try {
  await setup();
  console.log('Setup completed.');
} catch(error) {
  console.warn('Database is not ready yet. Skipping seeding...\n', error);
}

export { setup };


