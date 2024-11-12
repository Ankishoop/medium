import z, { string } from "zod";

export const signupInput = z.object({
  email: z.string().email().endsWith("gmail.com"),
  password: z.string().min(5),
  name: z.string(),
});
export const signinInput = z.object({
  email: z.string().email().endsWith("gmail.com"),
  password: z.string().min(5),
});

//type infer for frontend end

export const blogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.string(),
});

export type SignInInput = z.infer<typeof signinInput>;
export type BlogInput = z.infer<typeof blogInput>;
export type UpdatedBlogInput = z.infer<typeof updateBlogInput>;
export type SignInput = z.infer<typeof signupInput>;
