"use client";

import axios from "axios";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { register } from "../../../lib/api/clientApi";
import { useAuthStore } from "../../../lib/store/authStore";
import css from "./page.module.css";

type AuthFormValues = {
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const { setAuthState } = useAuthStore();

  const handleSubmit = async (
    values: AuthFormValues,
    helpers: FormikHelpers<AuthFormValues>,
  ) => {
    helpers.setStatus(undefined);

    try {
      const user = await register({
        email: values.email.trim(),
        password: values.password.trim(),
      });
      setAuthState(user);
      router.push("/profile");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Registration failed";
        helpers.setStatus(message);
      } else {
        helpers.setStatus("Registration failed");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ status, isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="email">Email</label>
              <Field
                id="email"
                type="email"
                name="email"
                className={css.input}
                required
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="password">Password</label>
              <Field
                id="password"
                type="password"
                name="password"
                className={css.input}
                required
              />
            </div>

            <div className={css.actions}>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting}
              >
                Register
              </button>
            </div>

            {status && <p className={css.error}>{status}</p>}
          </Form>
        )}
      </Formik>
    </main>
  );
}
