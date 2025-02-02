import { z } from "zod";
// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

export const SignupFormSchema = z
  .object({
    name: z.string().min(2, { message: "Must have atleast 2 characters" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Must have atleast 8 character" })
      .regex(passwordValidation, { message: "At least one uppercase letter, one lowercase letter, one number and one special character" }),
    passwordcnf: z.string(),
  })
  .refine((data) => data.password === data.passwordcnf, {
    message: "Passwords do not match",
    path: ["passwordcnf"],
  });
