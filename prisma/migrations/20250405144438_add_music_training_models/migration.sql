-- CreateTable
CREATE TABLE "daily_chords" (
    "userId" UUID NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "chordRoot" TEXT NOT NULL,
    "chordType" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_chords_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "free_mode_attempts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "chordRoot" TEXT NOT NULL,
    "chordType" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "complexity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "free_mode_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "userId" UUID NOT NULL,
    "totalCorrect" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "dailyStreak" INTEGER NOT NULL DEFAULT 0,
    "avgTime" DOUBLE PRECISION DEFAULT 0,
    "bestDailyTime" INTEGER,
    "lastAttempt" TIMESTAMP NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "daily_chords" ADD CONSTRAINT "daily_chords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "free_mode_attempts" ADD CONSTRAINT "free_mode_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
