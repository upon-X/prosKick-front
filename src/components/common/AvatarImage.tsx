import Image from "next/image";

export const AvatarImage = ({
  avatar_url,
  name,
}: {
  avatar_url: string;
  name: string;
}) => {
  return avatar_url ? (
    <Image
      src={avatar_url}
      alt={`${name} image`}
      width={64}
      height={64}
      className="h-16 w-16 rounded-full"
    />
  ) : (
    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
      <span className="text-2xl font-bold text-gray-600">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
