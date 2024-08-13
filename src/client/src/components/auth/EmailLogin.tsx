import EmailInputField from "@/components/auth/EmailInputField.tsx";
import PasswordInput from "@/components/auth/PasswordInput.tsx";
import SubmitButton from "@/components/auth/SubmitButton.tsx";
import {loginSchema, TLoginSchema} from "@/constants/interfaces.ts";
import {FORGOT_PASSWORD_URL, HOME_URL} from "@/constants/urls.ts";
import {authV2, AuthV2ResponseInterface, login} from "@/store/auth/actions/authV2.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Icon} from "@iconify/react";
import {Button, Checkbox, Link} from "@nextui-org/react";
import React from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "sonner";

const EmailLogin = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useAppDispatch();

  const location = useLocation();
  const from = location.state?.from || HOME_URL;
  const navigate = useNavigate();

  const [isEmailLogin, setIsEmailLogin] = React.useState(false);
  const [isRememberMe, setIsRememberMe] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data: TLoginSchema) => {
    const authData = {
      email: data.email,
      password: data.password,
      type: "login" as typeof login,
    }
    const response: AuthV2ResponseInterface = await dispatch(authV2(authData));
    if (response.success) {
      navigate(from, { replace: true });
    } else {
      const errors = response.errors;
      if (!errors) {
        toast.error(t("errors.unexpectedError"));
        return;
      }

      (Object.keys(errors) as Array<keyof TLoginSchema>).forEach((key) => {
        if (errors[key]) {
          setError(key, {
            type: "server",
            message: errors[key] || t("errors.unexpectedError"),
          });
        }
      });
    }
  };

  return (
    isEmailLogin ? (
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <EmailInputField register={register} errorMessage={errors["email"]?.message} isSubmitting={isSubmitting} id={"loginEmail"}/>
        <PasswordInput register={register} errorMessage={errors["password"]?.message} isSubmitting={isSubmitting}
                       type="password" id={"loginPassword"}/>
        <div className="flex items-center justify-between px-1 py-2">
          <Checkbox
            name="remember"
            size="sm"
            isInvalid={!isRememberMe}
            isDisabled={isSubmitting}
            defaultSelected={isRememberMe}
            onValueChange={(value) => setIsRememberMe(value)}
          >
            {t("auth.login.rememberMe")}
          </Checkbox>
          <Link className="text-default-500" href={FORGOT_PASSWORD_URL} size="sm">
            {t("auth.login.forgotPassword")}
          </Link>
        </div>
        <SubmitButton isDisabled={isSubmitting} isLoading={isSubmitting} title={t("navigation.login")}/>
      </form>
    ) : (
      <Button
        className="w-full"
        color="primary"
        startContent={<Icon icon="ic:baseline-email" width={24}/>}
        onClick={() => setIsEmailLogin(true)}
      >
        {t("auth.login.withEmail")}
      </Button>
    )
  );
}

export default EmailLogin;
