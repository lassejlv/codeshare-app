// Form
const title = document.getElementById("title");
const language = document.getElementById("language");
const code = document.getElementById("code");
const requirePassword = document.getElementById("requirePassword");
const password = document.getElementById("password");
const form = document.getElementById("snippetForm");
const createBtn = document.getElementById("createBtn");
const createdSnippetArea = document.getElementById("createdSnippetArea");
const createdSnippetLink = document.getElementById("createdSnippetLink");

// Get the title
title.onchange = function () {
  let value = title.value;
  console.log(value.length);
  if (value.length < 3 || value.length > 50) {
    title.setAttribute("aria-invalid", "true");
  } else {
    title.setAttribute("aria-invalid", "false");
  }
};

// Get the language
language.onchange = function () {
  let value = language.value;
  if (value === "null") {
    language.setAttribute("aria-invalid", "true");
  } else {
    language.setAttribute("aria-invalid", "false");
  }
};

// Get the code
code.onchange = function () {
  let value = code.value;
  if (value.length < 10 || value.length > 5000) {
    code.setAttribute("aria-invalid", "true");
  } else {
    code.setAttribute("aria-invalid", "false");
  }
};

// Get the password
requirePassword.onchange = function () {
  let value = requirePassword.checked;
  console.log(value);
  if (value === true) {
    password.classList.remove("hidden");
  } else {
    password.classList.add("hidden");
  }
};

// Submit the form and fetchAPI
form.onsubmit = function (e) {
  // Prevent the page to load on submit
  e.preventDefault();

  // Set button loading state
  createBtn.setAttribute("aria-busy", "true");
  createBtn.innerText = "Creating...";

  // Create form data
  const data = new FormData(form);

  // Put form data into object
  const snippet = {
    title: data.get("title"),
    language: data.get("language"),
    code: data.get("code"),
    keepHidden: data.get("keepHidden"),
    password: data.get("password"),
    requirePassword: data.get("requirePassword"),
  };

  fetch("http://localhost:3001/api/snippet/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet,
    }),
  })
    .then(async (res) => {
      const data = await res.json();
      console.log(res.status);
      form.reset();
      form.classList.add("hidden");
      createdSnippetArea.classList.remove("hidden");
      createdSnippetLink.value = `${window.location.href}snippet.html?id=${data.snippet.shortId}`;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/languages.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.forEach((language) => {
        const option = document.createElement("option");
        option.value = language.prefix;
        option.innerText = language.name;
        document.getElementById("language").appendChild(option);
      });
    });
});
