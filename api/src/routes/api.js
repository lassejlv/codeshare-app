import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
import bcrypt from "bcryptjs";

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

      if (findSnippet && findSnippet.requirePassword) {
        res.status(400).json({
          message: "Snippet requires password, use snipppet/password instead",
        });
      } else {
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

router.get("/snippet/:id/password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;
  if (!id || !password) {
    res
      .status(400)
      .json({ message: "No snippet ID provided -- No Password provided" });
  } else {
    try {
      const findSnippet = await prisma.snippet.findUnique({
        where: {
          shortId: id,
        },
      });

      const isPassword = bcrypt.compareSync(password, findSnippet.password);

      if (findSnippet && !isPassword) {
        res.status(400).json({
          message: "Password is incorrect for this snippet",
        });
      } else {
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
  let { filter } = req.query;
  if (!filter) {
    filter = "most_viewed";
  }
  let allowedFilters = ["most_viewed", "most_recent"];
  if (!allowedFilters.includes(filter))
    return res.status(400).json({ message: "Invalid filter provided" });

  try {
    const snippets = await prisma.snippet.findMany({
      where: {
        keepHidden: false,
      },
      orderBy: {
        ...(filter && filter === "most_viewed" && { views: "desc" }),
        ...(filter && filter === "most_recent" && { createdAt: "desc" }),
      },
      select: {
        title: true,
        language: true,
        shortId: true,
        views: true,
        requirePassword: true,
        password: false,
        createdAt: true,
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
        password: bcrypt.hashSync(snippet.password, 10) ?? null,
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
