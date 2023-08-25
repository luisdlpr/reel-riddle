## Dev Log
### 25/08/2023
Began development. This application will be a movie guessing game where given some details about a movie (plot, cast, year, genres etc) you guess the movie title. A single puzzle will be avaliable per day similar to games such as wordle. Hints like cast will be locked behind some sort of cooldown system or reduce the amount of points gained for solving the riddle. There will also be some sort of leaderboard mechanic showing the ladder of top players in the world and your score.

I originally wanted the hints to be a few emoji's relating to the movie (kong vs godzilla would give the hint gorilla emoji, lizard emoji etc). Looking into emoji translation modules and doing some testing, attempts at auto generating these types of hints based on movie data were not good. Also looked into some machine learning or AI solutions but these seem overcomplicated or require payment etc and are not always 100% accurate. This could be done in the future, however decided that other hints could work better / be more fun.

Set up as a next.js project with a simple sqlite database connected using prisma. Since the database requirements for this application are lightweight, this database should be fine. Was able to pull a list of popular movies from the TMDB API with all the required hint data and push to the database through an API endpoint. Need to look into how daily resets should work.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
