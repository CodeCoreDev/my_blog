import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="lofi">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className="antialiased text-white">
        <div className="flex flex-col min-h-screen px-6 bg-grid-pattern sm:px-12">
          <div className="flex flex-col w-full max-w-5xl mx-auto grow">
            <Header />
            <div className="grow">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}


