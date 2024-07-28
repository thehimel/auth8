"use client";

import {useAppSelector} from "@/store/hooks.ts";
import {isValidUsername} from "@/utils/validate.ts";
import {CardProps, Spinner} from "@nextui-org/react";

import {Card, CardHeader, CardBody, Button, Avatar, Badge, Input, CardFooter} from "@nextui-org/react";
import React, {FormEvent, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const Profile = (props: CardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.auth.loggedIn);

  const [isLoading, setIsLoading] = React.useState(false);

  const [username, setUsername] = React.useState(useAppSelector((state) => state.auth.userData.user.username));
  const email = useAppSelector((state) => state.auth.userData.user.email);
  const [firstName, setFirstName] = React.useState(useAppSelector((state) => state.auth.userData.user.first_name));
  const [lastName, setLastName] = React.useState(useAppSelector((state) => state.auth.userData.user.last_name));

  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");

  const [isUsernameValid, setIsUsernameValid] = React.useState(true);
  const [isFirstNameValid, setIsFirstNameValid] = React.useState(true);
  const [isLastNameValid, setIsLastNameValid] = React.useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the path to redirect to after login
      const redirectPath = location.pathname;
      navigate('/login', { state: { from: redirectPath } });
    }
  }, [isLoggedIn, navigate, location]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let isFormValid = true;

    if (!isValidUsername(username)) {
      setIsUsernameValid(false);
      setUsernameErrorMessage("Username must be at least 6 characters long and alphanumeric only.");
      isFormValid = false;
    } else {
      setUsernameErrorMessage("");
      setIsUsernameValid(true);
    }

    if (!firstName.length) {
      setIsFirstNameValid(false);
      setFirstNameErrorMessage("Enter a valid first name.");
      isFormValid = false;
    } else {
      setFirstNameErrorMessage("");
      setIsFirstNameValid(true);
    }

    if (!lastName.length) {
      setIsLastNameValid(false);
      setLastNameErrorMessage("Enter a valid first name.");
      isFormValid = false;
    } else {
      setLastNameErrorMessage("");
      setIsLastNameValid(true);
    }

    if (isFormValid) {
      setIsLoading(true);
      const params = {username, email, firstName, lastName}
      console.log(params);
    }
  };

  return isLoggedIn ? (
      <Card className="max-w-xl p-2" {...props}>
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large text-center">Account Details</p>
          <div className="flex gap-4 py-4">
            <Badge isInvisible>
              <Avatar className="h-14 w-14" src="/static/avatar.svg"/>
            </Badge>
            <div className="flex flex-col items-start justify-center">
              <p className="font-medium">Please add your name.</p>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              isRequired
              label="Username"
              name="username"
              autoComplete="username"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter username"
              errorMessage={!isUsernameValid ? usernameErrorMessage : undefined}
              isInvalid={!isUsernameValid}
              value={username}
              onValueChange={(value) => {
                setIsUsernameValid(true);
                setUsername(value);
              }}
            />
            <Input
              isRequired
              readOnly
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter email"
              value={email}
            />
            <Input
              isRequired
              label="First Name"
              name="firstName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter first name"
              errorMessage={!isFirstNameValid ? firstNameErrorMessage : undefined}
              isInvalid={!isFirstNameValid}
              value={firstName}
              onValueChange={(value) => {
                setIsFirstNameValid(true);
                setFirstName(value);
              }}
            />
            <Input
              isRequired
              label="Last Name"
              name="lastName"
              labelPlacement="outside"
              type="text"
              variant="bordered"
              placeholder="Enter last name"
              errorMessage={!isLastNameValid ? lastNameErrorMessage : undefined}
              isInvalid={!isLastNameValid}
              value={lastName}
              onValueChange={(value) => {
                setIsLastNameValid(true);
                setLastName(value);
              }}
            />
          </CardBody>
          <CardFooter className="mt-4 justify-end gap-2">
            <Button
              color="primary"
              type="submit"
              radius="full"
              isDisabled={isLoading}
              endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}
            >
              Save
            </Button>
          </CardFooter>
        </form>
    </Card>
  ) : null;
}

export default Profile;