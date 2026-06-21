"use client";

import { Formik, Form, Field } from "formik";
import { register } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import axios from "axios";
// import { redirect } from "next/navigation";

export default function SignUpPage() {
  const { setAuthState } = useAuthStore();
  const handleSubmit = async (
    values: { email: string; password: string },
    { setStatus }: { setStatus: (status?: string) => void },
  ) => {
    setStatus(undefined);
    try {
      const response = await register(values);
      setAuthState(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          "Registration failed";
        setStatus(message);
        return;
      }
      setStatus("Registration failed");
    }
  };
  return (
    <Formik initialValues={{ email: "", password: "" }} onSubmit={handleSubmit}>
      {({ status }) => (
        <Form>
          <label htmlFor="email">Email</label>
          <Field name="email" id="email" type="email" />
          <label htmlFor="password">Password</label>
          <Field name="password" id="password" type="password" />
          {status && <p>{status}</p>}
          <button type="submit">Sign Up</button>
        </Form>
      )}
    </Formik>
  );
}
