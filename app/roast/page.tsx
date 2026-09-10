import Link from "next/link";
export const metadata = { title: "exiled. obviously." };
export default function Roast() {
  return (
    <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <p className="text-6xl mb-6">{"\u{1F480}"}</p>
      <h1 className="text-4xl font-black mb-4">you have been exiled.</h1>
      <p className="italic opacity-80 mb-2">the raccoons voted. it was unanimous.</p>
      <p className="italic opacity-80 mb-8">your crimes: clicking things. existing. being here.</p>
      <Link href="/" className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-sm">beg for return</Link>
      <p className="mt-6 text-xs opacity-50">return requests are reviewed never.</p>
    </div>
  );
}
