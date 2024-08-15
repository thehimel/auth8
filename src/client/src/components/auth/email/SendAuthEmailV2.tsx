"use client";

import AuthHeader from "@/components/auth/email/AuthHeader.tsx";
import EmailInputField, {TEmailInputFieldRegister} from "@/components/auth/email/fields/EmailInputField.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {MessageInterface} from "@/constants/interfaces.ts";
import {sendAuthEmailSchema, TSendAuthEmailSchema} from "@/schemas/auth.ts";
import {
  SendAuthEmailResponseV2Interface,
  sendAuthEmailV2,
  SendAuthEmailV2Interface,
} from "@/store/auth/actions/sendAuthEmailV2.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {FC} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {toast} from "sonner";

export type AuthEmailRequestType = "resend_email_verification" | "forgot_password";

interface SendEmailProps {
  type: AuthEmailRequestType;
}

const SendAuthEmailV2: FC<SendEmailProps> = ({type}) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { t } = useTranslation();

  const isResendEmailVerificationPage = type === "resend_email_verification";
  const isForgotPasswordPage = type === "forgot_password";

  const headerTitle= isResendEmailVerificationPage ? t("auth.emailVerification.resendEmail")
    : isForgotPasswordPage ? t("auth.login.forgotPassword") : t("common.welcome")

  const initialHeadline: MessageInterface = {
    text: isResendEmailVerificationPage ?
      t("auth.emailVerification.failed")
      : isForgotPasswordPage ? t("auth.passwordReset.enterEmail") : t("common.welcome"),
    color: isResendEmailVerificationPage ? "danger" : "default",
  }

  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [headline, setHeadline] = React.useState(initialHeadline);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSendAuthEmailSchema>({
    resolver: zodResolver(sendAuthEmailSchema(t)),
  });

  const onSubmit = async (data: TSendAuthEmailSchema) => {
    const params: SendAuthEmailV2Interface = { email: data.email, type: type }

    const response: SendAuthEmailResponseV2Interface = await dispatch(sendAuthEmailV2(params))

    if (response.success) {
      setIsEmailSent(true);
      setHeadline({
        text: t(isResendEmailVerificationPage
          ? "auth.emailVerification.emailSent"
          : "auth.passwordReset.emailSent"),
        color: "default",
      });
      return;
    }

    const errors = response.errors;
    if (!errors) {
      toast.error(t("errors.unexpectedError"));
      return;
    }

    setError("email", {
      type: "server",
      message: errors["email"] || t("errors.unexpectedError"),
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AuthHeader title={headerTitle}/>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <p className={`text-${headline.color}`}>{headline.text}</p>
        {!isEmailSent &&
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <EmailInputField
              register={register as TEmailInputFieldRegister}
              errorMessage={errors["email"]?.message}
              isSubmitting={isSubmitting}
            />
            <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("forms.send")}/>
          </form>
        }
      </div>
    </div>
  );
}

export default SendAuthEmailV2;
