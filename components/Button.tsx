import Link from "next/link";

interface ButtonProps {
  text: string,
  link?: string;
}

export default function Button({ text, link }: ButtonProps) {
  return (
    Link ? (<Link href={link!} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-center block">
      {text}
    </Link>
  ) : (
    <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
      {text}
    </button>
  ));
}
