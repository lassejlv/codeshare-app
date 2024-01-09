import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json"
import { cors } from 'hono/cors'
import prisma from "./util/prisma";

const app = new Hono();

app.use("*", prettyJSON())
app.use('/*', cors())

app.get("/", async (c) => {
  return c.json({ message: "Hello World" });
});

app.route("/snippets/:id")
  // GET /snippets/:id
  .get(async (c) => {
    const snippet = await prisma.snippet.findUnique({ where: { id: c.req.param("id")} })
    if (!snippet) {
      c.status(404)
      return c.json({ error: "not found" })
    } else {
      c.status(200)
      return c.json({ message: "ok", data: snippet })
    }
  })

app.route("/snippets")
// GET /snippets (get with a limit of 20 for each request) (we dont include "password")
.get(async (c) => {
  const snippets = await prisma.snippet.findMany({ take: 20, where: { keepHidden: false }, select: { id: true, title: true, language: true, code: false, views: true, requirePassword: true } })
  c.status(200)
  return c.json({ message: "ok", data: snippets })
})
// POST /snippets (create snippet)
.post(async (c) => {
  const { title, language, code, keepHidden, requirePassword, password } = await c.req.json()

  if (!title || !language || !code) {
    c.status(400)
    return await c.json({ error: "missing fields" })
  } else {
    const newSnippet = await prisma.snippet.create({
      data: {
        title: title,
        language: language,
        code: code,
        keepHidden: keepHidden || false,
        requirePassword: requirePassword || false,
      }
    })

    c.status(201)
    return c.json({ message: "ok", data: newSnippet })
  }
})


export default app;
