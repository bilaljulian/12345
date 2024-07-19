// prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// schema.prisma
datasource db {
  provider = "postgresql" // Change this to your database provider
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  phone     String?
  password  String
  zip       String?
  city      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  items     Item[]
}

model Item {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  pictureUrl  String
  price       Float
  category    Category
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id    Int      @id @default(autoincrement())
  name  String   @unique
  items Item[]
}

model FeaturedListing {
  id          Int      @id @default(autoincrement())
  itemId      Int
  item        Item     @relation(fields: [itemId], references: [id])
  startDate   DateTime
  endDate     DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Example usage
import prisma from './prisma';

// Function to create a new user
async function createUser(email: string, name: string, phone: string, password: string, zip: string, city: string) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone,
      password,
      zip,
      city,
    },
  });
  return user;
}

// Function to add a new item
async function addItem(title: string, description: string, pictureUrl: string, price: number, userId: number, category: string) {
  const item = await prisma.item.create({
    data: {
      title,
      description,
      pictureUrl,
      price,
      userId,
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    },
  });
  return item;
}

// Function to get featured listings
async function getFeaturedListings() {
  const featuredListings = await prisma.featuredListing.findMany({
    include: {
      item: true,
    },
  });
  return featuredListings;
}

// .env
// DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
