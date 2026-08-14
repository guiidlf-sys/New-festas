/*
  Warnings:

  - Made the column `eventType` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPriceCents" INTEGER NOT NULL,
    "depositCents" INTEGER,
    "stripeSessionId" TEXT,
    "stripePaymentUrl" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Reservation" ("createdAt", "depositCents", "email", "endDate", "eventType", "fullName", "guests", "id", "message", "paidAt", "phone", "startDate", "status", "stripePaymentUrl", "stripeSessionId", "totalPriceCents", "updatedAt") SELECT "createdAt", "depositCents", "email", "endDate", "eventType", "fullName", "guests", "id", "message", "paidAt", "phone", "startDate", "status", "stripePaymentUrl", "stripeSessionId", "totalPriceCents", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX "Reservation_startDate_endDate_idx" ON "Reservation"("startDate", "endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
