// pages/index.js

import Markdown from "../components/markdown";

const content = `
В разработке
`;

export default function Home() {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Главная</h1>
        <Markdown content={content} />
      </div>
    </>
  );
}
