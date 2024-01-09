import { useState } from "react";
import { FaCopy } from "react-icons/fa";

export default function Success({ snippetId }) {
  const url = `${window.location.origin}/s/${snippetId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(url);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 m-10">
      <h3 className="font-semibold text-3xl text-white mb-2">
        Your snippet has been created 🎉
      </h3>

      <p className="text-gray-300">
        Share it with your friends using the link below!
      </p>

      <input type="text" className="mt-5 select-all" readOnly value={url}  />

      <button onClick={handleCopy}>

         {copied ? "Copied!" : <span><FaCopy className="inline-block" /> Copy</span>}
      </button>
    </div>
  );
}
