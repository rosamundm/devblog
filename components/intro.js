import Link from "next/link";

export default function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-mono tracking-tighter leading-tight md:pr-8 drop-shadow-lg no-underline">
          rosamund.dev
      </h1>
      <h4 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
        <Link href={"/about/"}>
          about⟶
        </Link>
      </h4>
    </section>
  )
}
