import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { Analytics } from "@vercel/analytics/next"

import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically since it's imported above
config.autoAddCss = false; 


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeCookIn",
  description: "About food and people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <footer
          id="rodape"
          className="border-t border-orange-200/70 bg-white/70 backdrop-blur-sm"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
            <p className="text-gray-700 leading-relaxed">
              A We Cook In é uma plataforma digital de culinária que oferece aulas práticas em vídeo e eBooks exclusivos
              para você aprender a cozinhar de forma simples, rápida e no seu próprio ritmo. Ideal para iniciantes e para
              quem deseja evoluir na cozinha com confiança.
            </p>

            <div className="mt-6 grid gap-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Email</span> wecookin@gmail.com
              </p>  
              <p>
                <span className="font-semibold text-gray-900">Telefone</span> 4002 8922 
              </p>
              <p>
                <span className="font-semibold text-gray-900">Site</span>{" "}
                <a className="text-orange-600 hover:underline" href="https://we-cook-in.vercel.app/">
                  we cook in vercel app
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
