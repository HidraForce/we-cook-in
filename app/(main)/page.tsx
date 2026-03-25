import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  CookingPot,
  Sparkles,
  Users,
  Video,
  Wand2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative p-4 sm:p-8 overflow-x-hidden overflow-y-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-white to-orange-50" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl animate-wci-float" />
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl animate-wci-float [animation-delay:900ms]" />
        </div>

        <div
          id="hero"
          className="wci-card flex flex-col justify-center items-center text-center relative p-8 min-h-125 animate-wci-fade-up"
        >
          <Image src="/images/hero.png" alt="Hero Image" fill className="object-cover absolute -z-10 rounded-4xl" />
          <div id="content" className="w-full max-w-4xl p-8 bg-white/80 rounded-2xl ring-1 ring-orange-200/40">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
              Bem vindo a We Cook In!
            </h1>
            <p className="text-lg text-gray-700">
              Descubra receitas incríveis, dicas de cozinha e muito mais para tornar suas refeições inesquecíveis!
            </p>
            <div id="buttons" className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button className="cursor-pointer mt-6 px-5 py-2.5 bg-linear-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl shadow-sm transition-transform active:scale-[0.99]">
                Compre nosso ebook
              </button>
              <button className="cursor-pointer mt-6 px-5 py-2.5 bg-white/90 hover:bg-white text-gray-900 rounded-2xl border border-orange-200 shadow-sm transition-transform active:scale-[0.99]">
                Compre nosso curso completo + ebook
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-12 mt-14">
        {/* 1. SOBRE NÓS */}
        <section
          id="sobre-nos"
          className="wci-card p-6 sm:p-8 animate-wci-fade-up [animation-delay:60ms] bg-linear-to-br from-white via-white to-orange-50/60 border-orange-200/60"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/60">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Sobre nós</h2>
              <p className="mt-1 text-sm text-gray-600">
                Uma plataforma para aprender, cozinhar e criar memórias.
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">
            A We Cook In nasceu da paixão por transformar a cozinha em um espaço de criatividade, aprendizado e conexão.
            Somos uma plataforma dedicada a oferecer aulas de culinária práticas e acessíveis, além de eBooks exclusivos
            para quem deseja evoluir na cozinha, do iniciante ao entusiasta mais experiente.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Nosso propósito é mostrar que cozinhar pode ser simples, prazeroso e inspirador. Por isso, desenvolvemos
            conteúdos didáticos, receitas testadas e técnicas explicadas de forma clara, para que qualquer pessoa possa
            preparar pratos incríveis no dia a dia.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Acreditamos que a culinária vai além da comida: ela aproxima pessoas, resgata memórias e cria novas
            experiências. Na We Cook In, você aprende no seu ritmo, de onde estiver, com materiais pensados para facilitar
            sua jornada gastronômica.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Seja para cozinhar melhor em casa, aprender novas receitas ou até mesmo iniciar um novo projeto na cozinha,
            estamos aqui para caminhar com você.
          </p>
          <p className="mt-4 font-semibold text-gray-900">
            We Cook In. Aprenda, cozinhe e transforme momentos em experiências.
          </p>
        </section>

        {/* 2. PROPOSTA DE VALOR */}
        <section
          id="proposta-de-valor"
          className="wci-card p-6 sm:p-8 animate-wci-fade-up [animation-delay:120ms] bg-linear-to-br from-white via-white to-amber-50/70 border-amber-200/70"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 ring-1 ring-amber-200/70">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Proposta de valor</h2>
              <p className="mt-1 text-sm text-gray-600">
                Acessível, prática e transformadora, do início ao avançado.
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Na We Cook In, nossa proposta de valor é oferecer uma experiência completa de aprendizado culinário que seja
            acessível, prática e transformadora. Diferente de conteúdos dispersos e muitas vezes complexos, reunimos em um
            só lugar aulas estruturadas e eBooks organizados, pensados para facilitar o aprendizado do início ao avançado.
            Nosso foco é garantir que você realmente aprenda, colocando a mão na massa com confiança.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Aprendizado descomplicado",
                desc: "Aulas objetivas, passo a passo claro e técnicas explicadas de forma simples.",
              },
              {
                title: "Flexibilidade total",
                desc: "Estude no seu tempo, de onde estiver, sem pressão.",
              },
              {
                title: "Conteúdo confiável",
                desc: "Receitas testadas e métodos que funcionam na prática.",
              },
              {
                title: "Evolução real na cozinha",
                desc: "Você não apenas segue receitas, mas desenvolve habilidades.",
              },
              {
                title: "Custo-benefício",
                desc: "Acesso a conteúdos de qualidade por um investimento acessível.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white/70 border border-amber-200/60 p-4 transition hover:bg-white hover:-translate-y-0.5"
              >
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">
            Nossa missão é eliminar barreiras e mostrar que qualquer pessoa pode cozinhar bem, com orientação certa,
            prática e inspiração.
          </p>
        </section>

        {/* 3. COMO FUNCIONA */}
        <section
          id="como-funciona"
          className="wci-card p-6 sm:p-8 animate-wci-fade-up [animation-delay:180ms] bg-linear-to-br from-white via-white to-orange-50/70 border-orange-200/70"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
              <CookingPot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Como funciona</h2>
              <p className="mt-1 text-sm text-gray-600">Simples, direto e no seu ritmo.</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">Na We Cook In, tudo é simples e direto:</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Escolha as aulas ou eBooks que deseja.",
              "Acesse na hora após a inscrição ou compra.",
              "Aprenda no seu ritmo, sem prazos.",
              "Pratique na cozinha com o passo a passo.",
            ].map((t, idx) => (
              <div
                key={t}
                className="rounded-xl border border-orange-200/60 bg-white/70 p-4 transition hover:bg-white hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold text-orange-700">
                  Passo {idx + 1}
                </p>
                <p className="mt-1 text-gray-800">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-700">
            Assim, você evolui de forma prática e natural, no seu tempo.
          </p>
        </section>

        {/* 4. APRESENTAÇÃO DO PRODUTO */}
        <section
          id="produto"
          className="wci-card p-6 sm:p-8 animate-wci-fade-up [animation-delay:240ms] bg-linear-to-br from-white via-white to-amber-50/70 border-amber-200/70"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 ring-1 ring-amber-200/70">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Apresentação do produto</h2>
              <p className="mt-1 text-sm text-gray-600">Vídeos + eBooks no mesmo lugar.</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">
            A We Cook In é uma plataforma digital completa voltada para o ensino de culinária, que reúne aulas práticas em
            vídeo e eBooks exclusivos em um só lugar. Desenvolvida para atender desde iniciantes até quem já possui
            experiência na cozinha, a plataforma oferece conteúdos organizados, didáticos e focados na prática.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Cada aula foi pensada para ensinar técnicas, receitas e dicas essenciais de forma simples e eficiente. Com
            acesso online, você pode aprender quando e onde quiser, explorando diferentes estilos de receitas e
            aprimorando suas habilidades no seu próprio ritmo.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Mais do que um produto, a We Cook In é uma experiência de aprendizado que transforma a forma como você cozinha
            no dia a dia.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-orange-200/60 bg-linear-to-br from-white to-orange-50/70 p-4">
              <p className="font-semibold text-gray-900">Bônus do curso</p>
              <p className="mt-1 text-sm text-gray-700">
                Quando o aluno se inscrever no curso, ele receberá um ebook grátis completo com todas as receitas do
                curso.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200/60 bg-linear-to-br from-white to-amber-50/70 p-4">
              <p className="font-semibold text-gray-900">Recompensa por concluir</p>
              <p className="mt-1 text-sm text-gray-700">
                Quando o aluno completar o curso, receberá a oportunidade de convidar 5 pessoas para ganhar um kit de
                panela.
              </p>
            </div>
          </div>

          <blockquote className="mt-6 rounded-xl bg-white/70 border border-orange-200/60 p-4 text-gray-800 italic">
            “Cozinhar não é um talento. É uma habilidade que você desenvolve a cada prato. Comece hoje e surpreenda a si mesmo.”
          </blockquote>
        </section>

        {/* 5. PROVA SOCIAL */}
        <section
          id="prova-social"
          className="wci-card p-6 sm:p-8 animate-wci-fade-up [animation-delay:300ms] bg-linear-to-br from-white via-white to-orange-50/60 border-orange-200/70"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Prova social</h2>
              <p className="mt-1 text-sm text-gray-600">Comunidade crescendo com resultados reais.</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Milhares de pessoas já estão transformando sua forma de cozinhar com a We Cook In. Nossa comunidade cresce a
            cada dia com alunos que saíram do básico e hoje preparam receitas com muito mais confiança e criatividade.
          </p>
          <p className="mt-3 text-gray-700">Veja o que alguns alunos dizem:</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Eu não sabia nem por onde começar na cozinha. Hoje consigo fazer receitas completas sozinha!",
              "Didático, simples e muito prático. Realmente funciona no dia a dia.",
              "Os eBooks ajudam muito, sempre volto neles quando tenho dúvidas.",
            ].map((quote) => (
              <div
                key={quote}
                className="group rounded-xl bg-white/70 border border-orange-200/60 p-5 transition hover:bg-white"
              >
                <p className="text-gray-800">“{quote}”</p>
                <div className="mt-4 h-px bg-linear-to-r from-orange-200/0 via-orange-200/70 to-orange-200/0" />
                <p className="mt-3 text-xs font-semibold text-orange-700 opacity-80 group-hover:opacity-100 transition">
                  Aluno(a) We Cook In
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">
            Além disso, nossos conteúdos são desenvolvidos com receitas testadas e aprovadas, garantindo resultados reais
            para quem aplica. Junte-se a quem já está evoluindo na cozinha e descubra que você também pode.
          </p>
        </section>

        {/* 6. CHAMADA FINAL PARA AÇÃO (CTA) */}
        <section
          id="cta"
          className="wci-card p-6 sm:p-10 text-center animate-wci-fade-up [animation-delay:360ms] bg-linear-to-br from-orange-50/70 via-white to-amber-50/70 border-orange-200/70"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pronto para evoluir na cozinha?
          </h2>
          <p className="mt-3 text-gray-700">
            Aprenda no seu ritmo com aulas práticas e eBooks exclusivos em um só lugar.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="cursor-pointer px-7 py-3.5 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-colors shadow-sm hover:shadow active:scale-[0.99]">
              Começar agora
            </button>
            <button className="cursor-pointer px-7 py-3.5 rounded-2xl border border-orange-200 bg-white hover:bg-orange-50 text-gray-900 font-semibold transition-colors active:scale-[0.99]">
              Entrar
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
