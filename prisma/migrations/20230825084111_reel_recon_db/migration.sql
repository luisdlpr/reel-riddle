-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdb_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "poster_path" TEXT NOT NULL,
    "genres" TEXT NOT NULL,
    "producers" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "played" DATETIME
);
INSERT INTO "new_Movie" ("cast", "genres", "id", "played", "plot", "poster_path", "producers", "release_date", "title", "tmdb_id") SELECT "cast", "genres", "id", "played", "plot", "poster_path", "producers", "release_date", "title", "tmdb_id" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_tmdb_id_key" ON "Movie"("tmdb_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
