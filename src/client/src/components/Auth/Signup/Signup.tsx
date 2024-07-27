"use client";

import {EyeClosedIcon, EyeOpenIcon} from "@/components/Auth/Icons.tsx";
import {signup} from "@/store/auth/authActions.ts";
import {useAppDispatch} from "@/store/hooks.ts";
import {AppDispatch} from "@/store/store.ts";
import React, {FormEvent} from "react";
import {Button, Input, Checkbox, Link, Divider} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "./acme";

export default function Signup() {
  const dispatch: AppDispatch = useAppDispatch();

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState("");

  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const [isSignupSuccessful, setIsSignupSuccessful] = React.useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let isFormValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email validation
    if (email.length === 0 || !emailPattern.test(email)) {
      setEmailErrorMessage("Enter a valid email");
      setIsEmailValid(false);
      isFormValid = false;
    } else {
      setEmailErrorMessage("")
      setIsEmailValid(true);
    }

    // Password validation
    if (!password.length) {
      setIsPasswordValid(false);
      setPasswordErrorMessage("Enter a valid password");
      isFormValid = false;
    } else {
      setPasswordErrorMessage("");
      setIsPasswordValid(true);
    }

    // Confirm Password validation
    if (!confirmPassword.length) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordErrorMessage("Enter a valid password");
      isFormValid = false;
    } else if (confirmPassword !== password) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordErrorMessage("Passwords do not match");
      isFormValid = false;
    } else {
      setConfirmPasswordErrorMessage("")
      setIsConfirmPasswordValid(true);
    }

    // If the form is valid, proceed with the next steps
    if (isFormValid) {
      console.log(`Email: ${email}, Password: ${password}, confirmPassword: ${confirmPassword}`);
      await dispatch(signup({email, password, confirmPassword}));
      setIsSignupSuccessful(true);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center pb-2">
        <AcmeIcon size={60} />
        <p className="text-xl font-medium">Welcome</p>
        <p className="text-small text-default-500">Create your account to get started</p>
      </div>
      {!isSignupSuccessful ? (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              autoFocus
              isRequired
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              variant="bordered"
              errorMessage={!isEmailValid ? emailErrorMessage : undefined}
              isInvalid={!isEmailValid}
              value={email}
              onValueChange={(value) => {
                setIsEmailValid(true);
                setEmail(value);
              }}
            />
            <Input
              isRequired
              endContent={
                <button type="button" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? EyeClosedIcon: EyeOpenIcon}
                </button>
              }
              label="Password"
              name="password"
              autoComplete="new-password"
              variant="bordered"
              type={isPasswordVisible ? "text" : "password"}
              errorMessage={!isPasswordValid ? passwordErrorMessage : undefined}
              isInvalid={!isPasswordValid}
              value={password}
              onValueChange={(value) => {
                setIsPasswordValid(true);
                setPassword(value);
              }}
            />
            <Input
              isRequired
              endContent={
                <button type="button" onClick={toggleConfirmPasswordVisibility}>
                  {isConfirmPasswordVisible ? EyeClosedIcon : EyeOpenIcon}
                </button>
              }
              label="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              variant="bordered"
              type={isConfirmPasswordVisible ? "text" : "password"}
              errorMessage={!isConfirmPasswordValid ? confirmPasswordErrorMessage : undefined}
              isInvalid={!isConfirmPasswordValid}
              value={confirmPassword}
              onValueChange={(value) => {
                setIsConfirmPasswordValid(true);
                setConfirmPassword(value);
              }}
            />
            <Checkbox isRequired name="agree" className="py-4" size="sm">
              I agree with the&nbsp;
              <Link href="#" size="sm">
                Terms
              </Link>
              &nbsp;and&nbsp;
              <Link href="#" size="sm">
                Privacy Policy
              </Link>
            </Checkbox>
            <Button color="primary" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
            >
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="#" size="sm">
              Log In
            </Link>
          </p>
        </div>
        ) : (
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <p>Thanks for signing up. Please check your inbox to verify the email.</p>
        </div>
      )}
    </div>
  );
}