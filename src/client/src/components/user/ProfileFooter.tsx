"use client";

import {Button, CardFooter, Spinner} from "@nextui-org/react";

import {FC} from "react";

interface submitButtonProps {
  title: string;
  isLoading: boolean;
  isDisabled: boolean;
}

const ProfileFooter: FC<submitButtonProps> = ({title, isLoading, isDisabled}) => {
  return (
    <CardFooter className="justify-end gap-2">
      <Button
        className="w-full"
        color="primary"
        type="submit"
        isDisabled={isLoading || isDisabled}
        endContent={isLoading ? (<Spinner size="sm" color="default"/>) : null}
      >
        {title}
      </Button>
    </CardFooter>
  );
}

export default ProfileFooter;
