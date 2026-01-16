-- CreateTable
CREATE TABLE "ImportantDate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportantDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportantDate_userId_idx" ON "ImportantDate"("userId");

-- CreateIndex
CREATE INDEX "ImportantDate_date_idx" ON "ImportantDate"("date");

-- AddForeignKey
ALTER TABLE "ImportantDate" ADD CONSTRAINT "ImportantDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
