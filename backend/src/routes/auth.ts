import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import {
  signupInput,
  signinInput,
} from "@ankish100xdevs/codingguys-medium-common";

const authRouter = new Hono<{
  Bindings: {
    PRISMA_CONNECTION_POOL_DATABASE_URL: string;
    JWT_SECREAT: string;
  };
}>();

authRouter.post("/signup", async (c) => {
  console.log("HERe");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log("🚀 ~ authRouter.post ~ body:", body);

  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Input not correct",
    });
  }

  //zod , password hashing

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });

    console.log("🚀 ~ authRouter.post ~ user:", user);
    const token = await sign({ id: user.id }, c.env.JWT_SECREAT, "HS256");
    // console.log("🚀 ~ authRouter.get ~ token:", token);
    return c.json({
      jwt: token,
    });
  } catch (error) {
    return c.text("User invalid");
  }
});

authRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.PRISMA_CONNECTION_POOL_DATABASE_URL,
  }).$extends(withAccelerate());
  // return c.text("Hello Hono!");
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Input not correct",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });
  console.log("🚀 ~ authRouter.post ~ user:", user);

  if (!user) {
    c.status(403);
    return c.json({
      error: "User not Found",
    });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECREAT, "HS256");
  console.log("🚀 ~ authRouter.post ~ token:", token);

  return c.json({
    jwt: token,
  });
});

export { authRouter };
