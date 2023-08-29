export default function CastCard({
  castMember,
}: {
  castMember: { name: string; img_path: string };
}) {
  return (
    <div className="flex flex-col w-1/4 m-2 p-2 rounded-xl bg-indigo-700">
      <img
        className="rounded-xl"
        src={"https://image.tmdb.org/t/p/w500" + castMember.img_path}
      />
      <h2 className="text-indigo-50 m-2 text-wrap text-sm text-align-center">
        {castMember.name}
      </h2>
    </div>
  );
}
