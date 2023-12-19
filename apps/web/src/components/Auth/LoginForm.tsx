"use client";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { TextField } from "@/components/Common/TextField";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingBtn from "@/components/Common/LoadingBtn";

const validate = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const initValues: LoginFormValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginSubmitHandler = async (values: LoginFormValues) => {
    try {
      const signInResponse = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/events",
        ...values,
      });

      if (signInResponse?.error) {
        toast.error(signInResponse.error);
        return;
      }
      setLoading(true);
      router.push("/events");
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={loginSubmitHandler}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <TextField
                label="EMAIL"
                name="email"
                type="email"
                autoComplete="off"
              />
            </div>
            <div>
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              {loading ? (
                <LoadingBtn />
              ) : (
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold_1 rounded-md py-3 px-8 text-center font-semibold text-black transition-all w-full"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link
          href="/register"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Register Now
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
