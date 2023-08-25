-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "genres" TEXT NOT NULL,
    "producers" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "played" DATETIME NOT NULL
);
