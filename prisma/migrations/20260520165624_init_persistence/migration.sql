-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playthrough" (
    "id" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "playerId" TEXT,
    "playerName" TEXT,
    "playerEmail" TEXT,
    "state" JSONB NOT NULL,
    "decisions" JSONB NOT NULL DEFAULT '[]',
    "badenya" INTEGER NOT NULL DEFAULT 0,
    "fadenya" INTEGER NOT NULL DEFAULT 0,
    "nyama" INTEGER NOT NULL DEFAULT 0,
    "endingId" TEXT,
    "phase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playthrough_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Playthrough_deviceToken_key" ON "Playthrough"("deviceToken");

-- CreateIndex
CREATE INDEX "Playthrough_playerEmail_idx" ON "Playthrough"("playerEmail");

-- AddForeignKey
ALTER TABLE "Playthrough" ADD CONSTRAINT "Playthrough_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
