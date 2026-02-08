import Image from "next/image";
import { User } from "lucide-react";

type AvatarProps = {
  src?: string | null;
  name?: string;
  size?: number;
};

export default function Avatar({ src, name = "User", size = 40 }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  // ✅ Default avatar (blue background + icon)
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-blue-600 flex items-center justify-center"
    >
      <User className="text-white" size={size * 0.5} />
    </div>
  );
}
