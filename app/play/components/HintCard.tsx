import Image from "next/image";

export default function HintCard({
  hintInfo,
}: {
  hintInfo: { name: string; img_path: string };
}) {
  return (
    <div className="flex flex-col w-1/4 m-2 p-2 rounded-xl bg-indigo-700 align-center justify-center">
      <Image
        className="rounded-xl w-full h-auto"
        src={"https://image.tmdb.org/t/p/w500" + hintInfo.img_path}
        alt={`${hintInfo.name} photo`}
        width={500}
        height={750}
        priority={false}
      />
      <h2 className="text-indigo-50 m-2 text-wrap text-sm text-align-center">
        {hintInfo.name}
      </h2>
    </div>
  );
}
