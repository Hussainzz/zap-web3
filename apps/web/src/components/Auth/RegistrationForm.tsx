"use client";
import React from "react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { TextField } from "@/components/Common/TextField";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const validate = Yup.object().shape({
  fullname: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Password must match")
    .required("Confirm password is required"),
});

interface RegisterFormValues {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initValues: RegisterFormValues = {
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegistrationForm = () => {
  const router = useRouter();
  const registerSubmitHandler = async (values: RegisterFormValues) => {
    try {
      const result = await axios.post("/api/auth/register", values);
      if (result?.status === 201) {
        toast.success("User registration successful");
      }
      router.push('/login')
    } catch (error: any) {
      let errMsg = "Something went wrong";
      if (error?.response?.data?.status === "error") {
        errMsg = error.response.data.message;
      }
      toast.error(errMsg);
    }
  };

  
  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={registerSubmitHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div>
              <TextField
                label="Full Name"
                name="fullname"
                type="text"
                autoComplete="off"
              />
            </div>
            <div>
              <TextField
                label="Email"
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
            <div>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                className="bg-gold hover:bg-gold_1 rounded-md py-3 px-8 text-center font-semibold text-black transition-all w-full"
              >
                Sign Up
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already Registered?{" "}
        <Link
          href="/login"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign In
        </Link>
      </p>
    </>
  );
};

export default RegistrationForm;
