document.addEventListener("DOMContentLoaded", function () {
  // Getting the search query
  const query = new URLSearchParams(window.location.search);
  const filterQuery = query.get("filter");
  let filterType = filterQuery ? filterQuery : "most_viewed";

  // Make sure the filter is valid
  if (!filterType === "most_viewed" || !filterType === "most_recent") {
    filterType = "most_viewed";
  }

  fetch(`http://localhost:3001/api/snippets?filter=${filterType}`).then(
    async (res) => {
      if (!res.ok) {
        window.location.replace("/");
      } else {
        document.getElementById("loading").remove();
        const data = await res.json();
        const { snippets } = data;
        const snippetsContainer = document.getElementById("snippetsContainer");

        snippetsContainer.innerHTML = `
      
        <div class="grid !m-5 !gap-3 !grid-cols-1 md:!grid-cols-2">
            ${snippets
              .map(
                (snippet) =>
                  `
                 <article>
                   
                        <h1 class="text-lg text-gray-300  font-bold">
                            ${snippet.title}  <img src="${
                    window.location.origin
                  }/public/${snippet.language}.png" alt="${
                    snippet.title
                  }" class="w-10 h-10 rounded-full mr-2 object-cover inline-block ml-1" />
                        </h1>     
                 

                     <div class="inline-flex items-end justify-end">
                        <a role="button" href="/snippet/?id=${snippet.shortId}">
                           View Snippet
                        </a>
                     </div>

                    <footer>
                        Snippet by <span class="text-white">${
                          snippet.author ?? "Anonymous"
                        }</span> - ${snippet.views} views ${
                    snippet.requirePassword
                      ? "<a class='hover:no-underline text-gray-200' data-tooltip='This snippet require a password from the owner'>- 🔒</a>"
                      : ""
                  }
                            
                    </footer>
                 </article>
                `
              )
              .join("")}
        </div>
        
      `;
      }
    }
  );
});
