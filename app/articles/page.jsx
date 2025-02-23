import fs from "fs";
import path from "path";

export default async function ArticlesPage() {
  const files = fs.readdirSync(path.join(process.cwd(), "articles"));

  const articles = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(process.cwd(), "articles", file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      const matter = require("gray-matter");
      const { data } = matter(fileContent);

      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title || "Без названия",
        date: data.date,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Мои статьи</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.slug} className="mb-2">
            <a
              href={`/articles/${encodeURIComponent(article.slug)}`}
              className="text-blue-500 hover:underline"
            >
              {article.title} ({article.date})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
