import { useEffect, useState } from "react";
import { api_url } from "../config";

export default function Explore() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${api_url}/snippets`, { method: "GET" });
      if (!res.ok) {
        window.location.href = "/?error=fetch+failed";
      } else {
        const data = await res.json();
        console.log(data.data);
        setSnippets(data.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div
          className="flex items-center justify-center h-screen"
          aria-busy="true"
        ></div>
      ) : (
        <>
          <main className="flex flex-col md:flex-row justify-between m-10">
            <div>
              <h1 className="text-2xl text-gray-400 font-bold mb-2 text-center md:mb-0">
                Explore Snippets
              </h1>
            </div>

            <div className="w-full md:w-1/6">
              <details role="list">
                <summary aria-haspopup="listbox">Filter</summary>
                <ul role="listbox">
                  <li>
                    <a href="/explore?filter=most_viewed">
                      <i className="fas fa-eye"></i>
                      Most Views
                    </a>
                  </li>
                  <li>
                    <a href="/explore?filter=most_recent">
                      <i className="fas fa-clock"></i>
                      Most Recent
                    </a>
                  </li>
                </ul>
              </details>
            </div>
          </main>

          {snippets.length === 0 && (
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl text-gray-400 font-bold mb-2 text-center md:mb-0">
                No snippets found
              </h1>
            </div>
          )}

          <div class="grid !m-5 !gap-3 !grid-cols-1 md:!grid-cols-2">
            {snippets.map((snippet) => (
              <article key={snippet.id} data-id={snippet.id}>
                <h1 class="text-lg text-gray-300 mb-2 font-bold">
                  {snippet.title}
                  <img
                    src={`/${snippet.language}.png`}
                    alt={snippet.language}
                    className="w-10 h-10 rounded-full mr-2 object-cover inline-block ml-1"
                  />
                </h1>

                <div class="inline-flex items-end">
                  <a role="button" href={`/s/${snippet.id}`}>
                    View Snippet
                  </a>
                </div>

                <footer>
                  Snippet by{" "}
                  <span class="text-white">
                    {snippet.author ?? "Anonymous"}
                  </span>{" "}
                  - {snippet.views} views
                </footer>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
