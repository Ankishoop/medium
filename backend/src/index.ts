import { Hono } from "hono";

const app = new Hono<{
  Bindings: {
    PRISMA_CONNECTION_POOL_DATABASE_URL: string;
    JWT_SECREAT: string;
  };
}>();

// app.use("/api/v1/blog/*", async (c, next) => {
//   const header = c.req.header("Authorization") || "";
//   console.log("🚀 ~ app.use ~ header:", header);
//   const toekn = header.split(" ")[1];
//   const response = await verify(toekn, c.env.JWT_SECREAT);

//   if (response.id) {
//     next();
//   } else {
//     c.status(403);
//     return c.json({ error: "unAuthorized" });
//   }
// });

import { authRouter } from "./routes/auth";
import { blogRouter } from "./routes/blog";

app.route("/api/v1/auth", authRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

// postgres://avnadmin:AVNS_-tsPNyNDT9x1sXjOaUd@pg-20271e19-ankishkhandelwal705-fbec.b.aivencloud.com:12933/defaultdb?sslmode=require

// for proisma url:========->DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMGFhNjZkZjgtYmVjNS00Yzc5LWI4ZDEtNzk4NmNiZTNhM2VmIiwidGVuYW50X2lkIjoiY2ZiMjNjOGZkMjkyMjQ3ODMzOTg1YWIyMDYwM2RjMDVjZmMyOTIxNTg2OTgxNGU3NTc3ZDNkNTM0MDllOTg5YSIsImludGVybmFsX3NlY3JldCI6IjljMzA5ZWI1LWQ0YjMtNGQ1Ni1iNDRlLTliMzljZjU3YWIxOSJ9.WjD0zxYvoKEKR497O2dR45i4x7_pxeDcDjL6_VlIpK8"
