import Image from "next/image";
import Link from "next/link";

const navItems = [
  { linkText: "Домой", href: "/" },
  { linkText: "Мои проекты", href: "/my-projects" },
  { linkText: "Мои статьи", href: "/articles" },
  { linkText: "Загрузки", href: "/downloads" },
  { linkText: "About", href: "/about" },
];

export function Header() {
  return (
    <nav className="flex flex-wrap items-center gap-1 pt-10 pb-10 sm:pt-1 md:pb-10">
      {/* Логотип */}
      <Link href="/">
        <Image
          src="/logo-mini.png"
          alt="logo"
          width={100} // Укажите ширину (в пикселях)
          height={100} // Укажите высоту (в пикселях)
        />
      </Link>

      {/* Навигационные элементы */}
      {!!navItems?.length && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2"
              >
                {item.linkText}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* GitHub лого */}
      <div className="flex-grow justify-end hidden lg:flex lg:mr-1">
        <Link
          href="https://github.com/CodeCoreDev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/github-mark-white.svg" // Используйте абсолютный путь для файла из public
            alt="GitHub logo"
            width={50} // Укажите ширину (в пикселях)
            height={50} // Укажите высоту (в пикселях)
            className="w-7" // Дополнительные классы Tailwind CSS
          />
        </Link>
      </div>
    </nav>
  );
}
