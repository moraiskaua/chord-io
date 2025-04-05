-- CreateTable
CREATE TABLE "game_states" (
    "userId" UUID NOT NULL,
    "difficulty" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "gameOver" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "time" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP NOT NULL,

    CONSTRAINT "game_states_pkey" PRIMARY KEY ("userId","difficulty","date")
);

-- AddForeignKey
ALTER TABLE "game_states" ADD CONSTRAINT "game_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
