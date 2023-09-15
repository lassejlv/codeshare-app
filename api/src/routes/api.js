import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

router.get("/snippet/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "No snippet ID provided" });
  } else {
    try {
      const findSnippet = await prisma.snippet.findUnique({
        where: {
          shortId: id,
        },
      });

      if (findSnippet) {
        const updateViews = await prisma.snippet.update({
          where: {
            shortId: id,
          },

          data: {
            views: findSnippet.views + 1,
          },
        });

        res.status(200).send(findSnippet);
      } else {
        res.status(404).json({ message: "Snippet not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Unable to create snippet",
        error: {
          message: error.message,
        },
      });
    }
  }
});

router.get("/snippets", async (req, res) => {
  try {
    const snippets = await prisma.snippet.findMany({
      where: {
        keepHidden: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ snippets });
  } catch (error) {
    res.status(500).json({
      error: "Unable to create snippet",
      error: {
        message: error.message,
      },
    });
  }
});

router.post("/snippet/new", async (req, res) => {
  const { snippet } = req.body;
  if (!snippet) {
    res.status(400).json({ error: "No snippet in request body" });
  }

  try {
    const newSnippet = await prisma.snippet.create({
      data: {
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        keepHidden: snippet.keepHidden === "on" ? true : false,
        requirePassword: snippet.requirePassword === "on" ? true : false,
        password: snippet.password ?? null,
        views: 0,
      },
    });

    return res.status(200).json({
      message: "Snippet created successfully",
      snippet: newSnippet,
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to create snippet",
      error: {
        message: error.message,
      },
    });
  }
});

export default router;
