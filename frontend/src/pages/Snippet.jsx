import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_url } from "../config";
import { FaCopy } from "react-icons/fa";

export default function Snippet() {
  const [snippet, setSnippet] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${api_url}/snippets/${params.id}`, {
        method: "GET",
      });
      if (!res.ok) {
        window.location.href = "/?error=fetch+failed";
      } else {
        const data = await res.json();
        console.log(data.data);
        setSnippet(data.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(snippet.code);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <>
      {loading ? (
        <div classNameName="text-center">
          <div classNameName="spinner-border" role="status"></div>
        </div>
      ) : (
        <main className="m-10 bg-gray-600 bg-opacity-20 p-4">
          <h1 className="text-white text-3xl font-bold select-none">
            {snippet.title}
          </h1>
          <p className="italic text-gray-400">
            Created by{" "}
            <span className="text-white">{snippet.author ?? "Anonymous"}</span>
          </p>

          <div className="select-none">
            <p id="view-count" data-view-count={snippet.views}>
              <span className="text-white font-bold">Views:</span> {snippet.views}
            </p>
          </div>

          <div className="mt-4">
            <pre>
              <code id={`language-${snippet.language}`}>{snippet.code}</code>
            </pre>
          </div>

          <div className="inline-flex items-end justify-end mt-5">
            <button onClick={handleCopy}>
              {copied ? "Copied!" : <span><FaCopy className="inline-block" /> Copy</span>}
            </button>
          </div>
        </main>
      )}
    </>
  );
}
