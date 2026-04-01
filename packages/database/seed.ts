import dotenv from "dotenv";
import { PrismaClient, Plan, Platform, RevenueSource } from "@prisma/client";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient();

function dummyEncryptedToken(label: string) {
  return `enc:${label}:${crypto.randomBytes(24).toString("base64url")}`;
}

async function main() {
  const email = "test@creatoros.in";
  const creatorSlug = "test-creator";

  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: dummyEncryptedToken("passwordHash"),
      name: "Test Creator",
      creatorSlug,
      subscription: {
        create: {
          plan: Plan.PRO,
          status: "ACTIVE",
        },
      },
      platformConnections: {
        create: [
          {
            platform: Platform.YOUTUBE,
            accountId: "yt_test_account_1",
            accountName: "Test YouTube Channel",
            accessToken: dummyEncryptedToken("yt_access"),
            refreshToken: dummyEncryptedToken("yt_refresh"),
            tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
            scopes: ["read", "analytics"],
            metadata: { dummy: true },
          },
          {
            platform: Platform.INSTAGRAM,
            accountId: "ig_test_account_1",
            accountName: "test_creator",
            accessToken: dummyEncryptedToken("ig_access"),
            refreshToken: dummyEncryptedToken("ig_refresh"),
            tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
            scopes: ["read_insights"],
            metadata: { dummy: true },
          },
        ],
      },
    },
    include: { platformConnections: true },
  });

  const ytAccountId =
    user.platformConnections.find((c) => c.platform === Platform.YOUTUBE)
      ?.accountId ?? "yt_test_account_1";
  const igAccountId =
    user.platformConnections.find((c) => c.platform === Platform.INSTAGRAM)
      ?.accountId ?? "ig_test_account_1";

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);

  const snapshots: {
    userId: string;
    platform: Platform;
    accountId: string;
    snapshotAt: Date;
    views: bigint;
    subscribers: bigint;
    likes: bigint;
  }[] = [];

  for (let i = 0; i < 30; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    snapshots.push({
      userId: user.id,
      platform: Platform.YOUTUBE,
      accountId: ytAccountId,
      snapshotAt: day,
      views: BigInt(10_000 + i * 250),
      subscribers: BigInt(1_000 + i * 5),
      likes: BigInt(500 + i * 12),
    });

    snapshots.push({
      userId: user.id,
      platform: Platform.INSTAGRAM,
      accountId: igAccountId,
      snapshotAt: day,
      views: BigInt(8_000 + i * 220),
      subscribers: BigInt(2_000 + i * 7),
      likes: BigInt(650 + i * 15),
    });
  }

  await prisma.analyticsSnapshot.deleteMany({
    where: { userId: user.id, accountId: { in: [ytAccountId, igAccountId] } },
  });
  await prisma.analyticsSnapshot.createMany({ data: snapshots });

  await prisma.revenueEntry.deleteMany({ where: { userId: user.id } });
  await prisma.revenueEntry.createMany({
    data: [
      {
        userId: user.id,
        platform: Platform.YOUTUBE,
        source: RevenueSource.ADSENSE,
        amountPaisa: BigInt(125_000),
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        notes: "Sample AdSense payout",
      },
      {
        userId: user.id,
        source: RevenueSource.BRAND_DEAL,
        amountPaisa: BigInt(750_000),
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        notes: "Sample brand deal",
      },
      {
        userId: user.id,
        source: RevenueSource.AFFILIATE,
        amountPaisa: BigInt(52_500),
        occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        notes: "Sample affiliate payout",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });

