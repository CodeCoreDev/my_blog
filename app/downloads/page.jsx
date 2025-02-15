import Markdown from "../../components/markdown";

const content = `
В процессе разработки
`;

export default async function Page() {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Загрузки</h1>
        <Markdown content={content} />
      </div>
    </>
  );
}
