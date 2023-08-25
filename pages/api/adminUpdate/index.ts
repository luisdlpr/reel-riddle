import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const TMDB_API = "https://api.themoviedb.org/3";
const prisma = new PrismaClient();

interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

const fetchToJson = async (url: string) => {
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  };
  const fetchResponse = await fetch(TMDB_API + url, options);
  const fetchJSON = await fetchResponse.json();
  return fetchJSON;
};

const getMovies = async (res: NextApiResponse) => {
  const data = await prisma.movie.findMany();
  res.status(200).json({ response: data });
};

const pullMovies = async (res: NextApiResponse) => {
  const extraDetailsToString = (
    element: { [key: string]: any },
    extraDetails: [string],
  ) => {
    return `(${extraDetails
      .map((detail: string) => element[detail])
      .join(", ")})`;
  };

  const encodeDetailsToString = (data: [{}], extraDetails?: [string]) => {
    if (data == null) {
      throw new Error("data passed in was empty");
    }
    let detailsString = data.map((element: { [key: string]: any }) => {
      let extraDetailsString = "";
      if (extraDetails) {
        extraDetailsString = " " + extraDetailsToString(element, extraDetails);
      }
      return `${element.name}` + extraDetailsString;
    });
    return detailsString.join(", ");
  };

  const movieListResponseJSON = await fetchToJson(
    "/movie/popular?language=en-US&page=1",
  );

  await prisma.movie.deleteMany({});

  // no bulk add option for sqlite :(
  for (let movie of movieListResponseJSON.results) {
    if (movie.adult === false && movie.original_language === "en") {
      const movieDetails = await fetchToJson(`/movie/${movie.id}`);
      const movieCredits = await fetchToJson(`/movie/${movie.id}/credits`);

      let cast = "";
      let genres = "";
      let producers = "";

      try {
        cast = encodeDetailsToString(movieCredits.cast.slice(0, 3), [
          "profile_path",
        ]);
        genres = encodeDetailsToString(movieDetails.genres);
        producers = encodeDetailsToString(movieDetails.production_companies, [
          "logo_path",
        ]);
      } catch (error) {
        console.error("cast, genres, or producers was empty");
      }

      await prisma.movie.create({
        data: {
          tmdb_id: movie.id.toString(),
          title: movie.title,
          tagline: movieDetails.tagline,
          plot: movie.overview,
          poster_path: movie.poster_path,
          genres,
          producers,
          cast,
          release_date: new Date(movie.release_date).toISOString(),
          played: null,
        },
      });
    }
  }

  res.status(200).json({ response: "access granted" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (
    process.env.UPDATE_MOVIES === "OFF" ||
    req.query.password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(200).json({ response: "access denied" });
    return;
  }

  switch (method) {
    case "GET":
      getMovies(res);
      break;
    case "POST":
      pullMovies(res);
      break;
    default:
      // No matching method
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
