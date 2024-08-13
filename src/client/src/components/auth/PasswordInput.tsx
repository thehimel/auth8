import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { UseFormRegister } from "react-hook-form";
import {TLoginSchema, TSignUpSchema} from "@/constants/interfaces.ts";
import { EyeClosedIcon, EyeOpenIcon } from "@/components/icons/eyes.tsx";

interface PasswordInputProps {
  register: UseFormRegister<TSignUpSchema | TLoginSchema>;
  errorMessage?: string;
  isSubmitting: boolean;
  type: "password" | "confirmPassword";
  id: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ register, errorMessage, isSubmitting, type, id }) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <Input
      {...register(type)}
      id={id}
      isRequired
      endContent={
        <button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
        </button>
      }
      label={t(`forms.${type}`)}
      name={type}
      autoComplete="new-password"
      variant="bordered"
      type={isPasswordVisible ? "text" : "password"}
      errorMessage={errorMessage}
      isInvalid={!!errorMessage}
      isDisabled={isSubmitting}
    />
  );
};

export default PasswordInput;
