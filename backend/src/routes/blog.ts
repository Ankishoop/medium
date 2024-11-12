import { PrismaClient } from "@prisma/client/edge";
import { join } from "@prisma/client/runtime/react-native.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import {
  blogInput,
  updateBlogInput,
} from "@ankish100xdevs/codingguys-medium-common";

const blogRouter = new Hono<{
  Bindings: {
    PRISMA_CONNECTION_POOL_DATABASE_URL: string;
    JWT_SECREAT: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  console.log("🚀 ~ blogRouter.use ~ token:", token);
  const maontoken = token.split(" ")[1];
  console.log("🚀 ~ blogRouter.use ~ maontoken:", maontoken);
  const user = await verify(maontoken, c.env.JWT_SECREAT, "HS256");
  console.log("🚀 ~ blogRouter.use ~ user:", user);
  console.log("🚀 ~ blogRouter.use ~ user:", user);

  if (user) {
    c.set("userId", user.id as string);
    await next();
  } else {
    c.json({
      message: "unAuthorized",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  console.log("🚀 ~ blogRouter.post ~ body:", body);

  const { success } = blogInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: " blog Input not correct",
    });
  }

  const userId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });

    return c.json({ id: blog.id });
  } catch (error) {}
});
blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  console.log("🚀 ~ blogRouter.put ~ userId:", userId);
  console.log("🚀 ~ blogRouter.put ~ body:", body);

  const { success } = updateBlogInput.safeParse({ ...body, userId });

  if (!success) {
    c.status(411);
    return c.json({
      message: " blog updatedInput not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    console.log("🚀 ~ blogRouter.put ~ blog:", blog);
    return c.json({ id: blog.id });
  } catch (error) {}
});
blogRouter.get("/", async (c) => {
  const { blogId } = c.req.query();
  console.log("🚀 ~ blogRouter.get ~ blogId:", blogId);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
    });

    return c.json({ blog });
  } catch (error) {
    return c.json({
      message: "kfn",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  console.log("? in /bulk ");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany();
    console.log("🚀 ~ blogRouter.get ~ blogs:", blogs);
    return c.json({ blogs });
  } catch (error) {
    return c.json({
      message: "kfn",
    });
  }
});

export { blogRouter };
