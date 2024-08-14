import {TranslationFunctionType} from "@/constants/interfaces.ts";
import {z} from "zod";

export const updateProfileSchema = (t: TranslationFunctionType) =>
  z.object({
    username: z.string()
      .min(6, { message: t("errors.usernameTooShort") })
      .regex(/^[a-zA-Z0-9]+$/, { message: t("errors.usernameInvalidCharacters") }),
    firstName: z.string().min(1, { message: t("errors.invalidFirstName") }),
    lastName: z.string().min(1, { message: t("errors.invalidLastName") }),
  });

export type TUpdateProfileSchema = z.infer<ReturnType<typeof updateProfileSchema>>;