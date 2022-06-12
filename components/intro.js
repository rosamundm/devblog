import Link from "next/link";

export default function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-mono tracking-tighter leading-tight md:pr-8">
        Rosamund Mather
      </h1>
      <h4 className="text-right md:text-left text-lg mt-5 md:pl-8">
        <Link href={`/about/`}>a writer of code and prose</Link>
      </h4>
    </section>
  )
}
