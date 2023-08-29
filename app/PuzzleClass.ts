export default class Puzzle {
  id: string;
  tmdb_id: string;
  tagline: string;
  plot: string;
  genres: [string];
  producers: { name: string; img_path: string }[];
  cast: { name: string; img_path: string }[];
  release_date: Date;
  played: Date;
  space_hints: { spaces: number; nonAlphas: [{ symbol: string; idx: number }] };

  constructor(puzzleJSON: { [key: string]: any }) {
    this.id = puzzleJSON.id;
    this.tmdb_id = puzzleJSON.tmdb_id;
    this.tagline = puzzleJSON.tagline;
    this.plot = puzzleJSON.plot;
    this.genres = puzzleJSON.genres.split(", ");
    this.producers = this.parseDetailsString(puzzleJSON.producers);
    this.cast = this.parseDetailsString(puzzleJSON.cast);
    this.release_date = new Date(puzzleJSON.release_date);
    this.played = new Date(puzzleJSON.played);
    this.space_hints = puzzleJSON.space_hints;
  }

  parseDetailsString(details: string) {
    const detailsArray = details.split(", ");
    return detailsArray.map((detail) => {
      let splitDetail = detail.split("(");
      return { name: splitDetail[0], img_path: splitDetail[1].slice(0, -1) };
    });
  }
}
