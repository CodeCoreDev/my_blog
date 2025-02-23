// app/articles/[slug]/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Markdown from "../../../components/markdown";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "articles"));

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
    }));
}

export default async function ArticlePage({ params }) {
  // params должно быть await
  const { slug } = await params; // Ожидаем params перед использованием

  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(process.cwd(), "articles", `${decodedSlug}.md`);

  // Проверка на существование файла
  if (!fs.existsSync(filePath)) {
    return <div>Статья не найдена</div>;
  }

  // Чтение содержимого файла
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return <Markdown content={content} className="custom-class" />;
}
