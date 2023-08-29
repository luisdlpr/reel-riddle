export default function HintCard({
  hintInfo,
}: {
  hintInfo: { name: string; img_path: string };
}) {
  return (
    <div className="flex flex-col w-1/4 m-2 p-2 rounded-xl bg-indigo-700 align-center justify-center">
      <img
        className="rounded-xl"
        src={"https://image.tmdb.org/t/p/w500" + hintInfo.img_path}
      />
      <h2 className="text-indigo-50 m-2 text-wrap text-sm text-align-center">
        {hintInfo.name}
      </h2>
    </div>
  );
}
