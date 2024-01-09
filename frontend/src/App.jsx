import { useState } from "react";
import languages from "./languages.json";
import { FaShare, FaSyncAlt } from "react-icons/fa";
import { api_url } from "./config";
import Success from "./components/Success";

export default function App() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [keepHidden, setKeepHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [snippetId, setSnippetId] = useState(null);

  const handleCreate = async () => {
    setLoading(true);

    const res = await fetch(`${api_url}/snippets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        language,
        code,
        keepHidden,
      }),
    });

    if (!res.ok) {
      setLoading(false);
      return;
    } else {
      setTimeout(async() => {
        setCreated(true);
        const data = await res.json();
        setCreated(true);
        setSnippetId(data.data.id);
      }, 1500);
    }
  };

  const handleReset = () => {
    setTitle("");
    setLanguage("");
    setCode("");
    setKeepHidden(false);
  };

  return (
    <>
      {created ? (
        <Success snippetId={snippetId} />
      ) : (
        <>
          <main className="container mx-auto pt-10 p-4">
            {/* Title */}
            <div className="mb-5">
              <label>Title/Name of the snippet</label>
              <input
                type="text"
                placeholder="Title"
                required
                minLength={3}
                maxLength={50}
                onChange={(e) => {
                  const { value } = e.target;

                  if (value.length < 3) {
                    e.target.setAttribute("aria-invalid", true);
                  } else if (value.length > 50) {
                    e.target.setAttribute("aria-invalid", true);
                  } else {
                    setTitle(value);
                    e.target.setAttribute("aria-invalid", false);
                  }
                }}
              />
            </div>

            {/* Language */}
            <div className="mb-5">
              <label>Language</label>
              <select
                required
                className="p-2 mb-3"
                value={language}
                onChange={(e) => {
                  const { value } = e.target;
                  if (
                    !languages.find((language) => language.prefix === value)
                  ) {
                    e.target.setAttribute("aria-invalid", true);
                  } else {
                    setLanguage(value);
                    e.target.setAttribute("aria-invalid", false);
                  }
                }}
              >
                <option value="null" selected="">
                  Select programming language
                </option>
                {languages.map((language) => (
                  <option key={language.prefix} value={language.prefix}>
                    {language.name}
                  </option>
                ))}
              </select>
              <p className="text-md text-gray-400">
                Are we missing a language?{" "}
                <a className="text-[#0f94c0]" href="/?submit=true">
                  Let us know!
                </a>
              </p>
            </div>

            {/* Code */}
            <div className="mb-5">
              <label>Code</label>
              <p className="text-md text-gray-400">
                There are a max on 5000 characters and a minimum of 8
                characters.
              </p>

              <textarea
                placeholder="Code"
                required
                className="p-2 mt-4"
                minLength={8}
                maxLength={5000}
                cols={50}
                rows={5}
                onBlur={(e) => {
                  const { value } = e.target;

                  if (value.length < 8) {
                    e.target.setAttribute("aria-invalid", true);
                  } else if (value.length > 5000) {
                    e.target.setAttribute("aria-invalid", true);
                  } else {
                    setCode(value);
                    e.target.setAttribute("aria-invalid", false);
                  }
                }}
              />
            </div>

            {/* Options */}
            <fieldset>
              <label for="switch">
                <input
                  type="checkbox"
                  role="switch"
                  onChange={(e) => {
                    setKeepHidden(e.target.checked);
                  }}
                />
                Hide snippet from explore page
              </label>
            </fieldset>

            {/* Submit */}
            <div className="flex space-x-5 mt-5">
              <button
                className="text-white disabled:opacity-50"
                aria-busy={loading}
                disabled={loading || !title || !language || !code}
                onClick={handleCreate}
              >
                {loading ? (
                  <>Creating...</>
                ) : (
                  <>
                    <FaShare className="inline mr-2" />
                    Share
                  </>
                )}
              </button>
              <button
                className="!bg-[#596b79] hover:!bg-[#73818c] text-white border-none"
                onClick={handleReset}
              >
                <FaSyncAlt className="inline mr-2" />
                Reset
              </button>
            </div>
          </main>
        </>
      )}
    </>
  );
}
