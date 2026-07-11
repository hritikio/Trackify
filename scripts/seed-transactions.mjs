import "dotenv/config";
import { randomUUID } from "node:crypto";
import pg from "pg";

const { Client } = pg;

const expenseCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Refund",
];

const transactionBlueprints = {
  Expense: {
    categories: expenseCategories,
    titles: [
      "Groceries",
      "Taxi",
      "Movie",
      "Lunch",
      "Coffee",
      "Fuel",
      "Books",
      "Subscription",
      "Dinner",
      "Repair",
    ],
  },
  Income: {
    categories: incomeCategories,
    titles: [
      "Salary",
      "Freelance Payment",
      "Client Project",
      "Investment Return",
      "Gift",
      "Refund",
      "Side Income",
      "Bonus",
    ],
  },
};

const types = Object.keys(transactionBlueprints);

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomItem = (items) => items[getRandomInt(0, items.length - 1)];

const randomDateInRange = (startDate, endDate) => {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  return new Date(startMs + Math.random() * (endMs - startMs));
};

const SEED_START = new Date(2026, 6, 1); // July 1
const SEED_END = new Date(2026, 6, 1, 23, 59, 59, 999); // July 1 included

const buildTransaction = (userId) => {
  const type = getRandomItem(types);
  const { categories, titles } = transactionBlueprints[type];
  const category = getRandomItem(categories);
  const amount =
    type === "Income" ? getRandomInt(1000, 15000) : getRandomInt(50, 5000);
  const title = getRandomItem(titles);

  return {
    id: randomUUID(),
    amount,
    type,
    category,
    title,
    description: `${title} - ${category}`,
    date: randomDateInRange(SEED_START, SEED_END),
    userid: userId,
    createdAt: new Date(),
  };
};

const main = async () => {
  const count = Number(process.env.SEED_COUNT || 10);
  const email = process.env.SEED_EMAIL || "hkm@gmail.com";

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const userQuery = email
    ? {
        text: 'SELECT id, email FROM "User" WHERE email = $1 LIMIT 1',
        values: [email],
      }
    : {
        text: 'SELECT id, email FROM "User" ORDER BY "createdAt" ASC LIMIT 1',
        values: [],
      };

  const userResult = await client.query(userQuery);
  const user = userResult.rows[0];

  if (!user) {
    await client.end();
    throw new Error("No user found. Create a user first or set SEED_EMAIL.");
  }

  const data = Array.from({ length: count }, () => buildTransaction(user.id));

  const columns =
    'id, amount, type, category, title, description, date, userid, "createdAt"';
  const values = [];
  const placeholders = data.map((item, index) => {
    const offset = index * 9;
    values.push(
      item.id,
      item.amount,
      item.type,
      item.category,
      item.title,
      item.description,
      item.date,
      item.userid,
      item.createdAt,
    );
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`;
  });

  await client.query(
    `INSERT INTO "Transaction" (${columns}) VALUES ${placeholders.join(", ")}`,
    values,
  );

  await client.end();
  console.log(`Inserted ${count} transactions for ${user.email}.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // No-op: client is closed in main.
  });

// To run this script, use: `node scripts/seed-transactions.mjs`
