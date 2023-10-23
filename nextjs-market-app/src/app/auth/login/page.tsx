"use client";

import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);

    try {
      const data = await signIn("credentials", body);
      console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={"grid h-[calc(100vh_-_56px)] place-items-center "}>
      <form
        className={"flex flex-col justify-center gap-4 min-w-[350px]"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className={"text-2xl"}>Login</h1>
        <Input
          id={"email"}
          label={"Email"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id={"password"}
          label={"Password"}
          type={"password"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Button label={"Login"} onClick={() => console.log("click")} />
        <div className={"text-center"}>
          <p className={"text-gray-400"}>
            Not a member?{" "}
            <Link
              href={"/auth/register"}
              className={"text-black hover:underline"}
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
