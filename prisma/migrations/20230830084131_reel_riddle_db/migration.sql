-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "lastPlayed" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");
