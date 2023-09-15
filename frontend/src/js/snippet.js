document.addEventListener("DOMContentLoaded", function () {
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");
  // Check if user has provided an id
  if (!id) return window.location.replace("/");

  // Fetch snippet
  fetch(`http://localhost:3001/api/snippet/${id}`)
    .then(async (res) => {
      if (!res.status === 200 || !res.ok) {
        window.location.replace("/");
      } else {
        document.getElementById("loading").remove();
        const snippetContainer = document.getElementById("snippetContainer");
        const data = await res.json();

        snippetContainer.innerHTML = `
        
            <div class="m-10 bg-gray-600 bg-opacity-20 p-4">
                <h1 class="text-white text-3xl font-bold select-none">${
                  data.title
                }</h1>
                <p class="italic text-gray-400">
                    Created by <span class="text-white">${
                      data.author ?? "Anonymous"
                    }</span>
                </p>

                <div class="select-none">
                   <p id="view-count" data-view-count=${data.views}>
                     <span class="text-white font-bold">Views:</span> ${
                       data.views
                     }
                   </p>
                </div>

                <div class="mt-4">
                    <pre><code class="language-${data.language}">${
          data.code
        }</code></pre></div>

                    <div class="inline-flex items-end justify-end">
                        <button onclick="
                            const code = document.querySelector('pre code');
                            const textArea = document.createElement('textarea');
                            textArea.value = code.innerText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            textArea.remove();
                            this.setAttribute('aria-invalid', 'false');
                            this.innerText = 'Copied!';
                            setTimeout(() => {
                               // set back to default with the font awesome icon
                                this.innerHTML = '<i class=&quot;far fa-copy&quot;></i> Copy code';
                            }, 2000);

                        ">
                            <i class="far fa-copy"></i>
                            Copy code
                        </button>
                    </div>
                </div>
            </div>

        `;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
