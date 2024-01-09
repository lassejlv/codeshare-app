-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "keepHidden" BOOLEAN NOT NULL DEFAULT false,
    "requirePassword" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);
