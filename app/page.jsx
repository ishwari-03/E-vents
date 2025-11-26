
import Link from "next/link";
import { Button } from "../components/ux/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="pb-16 relative overflow-hidden">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

    {/* LEFT */}
    <div className="space-y-6 text-center sm:text-left">
      <span className="text-gray-500 font-light tracking-wide mb-6 block">
        Ai-vents<span className="text-blue-300">*</span>
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
        Discover &<br />Create Amazing<br /><span className="bg-linear-to-r from-blue-800 via-blue-400 to-pink-500 bg-clip-text text-transparent">Events</span>
      </h1>

      <p className="text-gray-600 max-w-md">
        Whether you're hosting or attending, Ai-vents is here to make everything
        memorable. Join the community.
      </p>

      <Link href="/explore">
        <Button size="lg" className="rounded-full px-6 py-4 text-lg">
          Get Started
        </Button>
      </Link>
    </div>

    {/* RIGHT */}
    <div className="relative flex justify-center lg:justify-end">
      <Image
        src="/hero.png"
        alt="react meetup"
        width={700}
        height={700}
        className="w-[90%] lg:w-[80%] h-auto object-contain"
        priority
      />
    </div>

  </div>
</section>

    </div>
  );
}
