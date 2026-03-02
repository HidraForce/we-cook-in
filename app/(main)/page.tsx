import Image from "next/image";

export default function Home() {
  return (
    <main className=" p-8" >
      <div id="hero" className="flex flex-col justify-center items-center text-center relative p-8 min-h-125">
        <Image src="/images/hero.png" alt="Hero Image" fill className="object-cover absolute -z-10 rounded-4xl" />
        <div id="content" className="w-full max-w-4xl p-8 bg-white/80 rounded-2xl">
          <h1 className="text-4xl font-bold mb-4">Bem vindo a We Cook In!</h1>
          <p className="text-lg text-gray-700">
            Descubra receitas incríveis, dicas de cozinha e muito mais para tornar suas refeições inesquecíveis!
          </p>
          <div id="buttons" className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button className="mt-6 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl">
              Compre nosso ebook
            </button>
            <button className="mt-6 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl">
              Compre nosso curso completo + ebook
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}
