import Image from "next/image";

export default function HintCard({
  hintInfo,
}: {
  hintInfo: { name: string; img_path: string };
}) {
  return (
    <div className="glass-card p-4 text-center min-w-[120px] max-w-[150px]">
      <div className="relative mb-3">
        <Image
          className="rounded-lg w-full h-auto object-cover"
          src={"https://image.tmdb.org/t/p/w500" + hintInfo.img_path}
          alt={`${hintInfo.name} photo`}
          width={500}
          height={750}
          priority={false}
          unoptimized={true}
        />
      </div>
      <h3 className="text-sm font-medium text-slate-200 leading-tight">
        {hintInfo.name}
      </h3>
    </div>
  );
}
