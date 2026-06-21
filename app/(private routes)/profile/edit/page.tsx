"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api/apiClient";
import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "./EditProfilePage.module.css";

type EditProfileValues = {
  username: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const { setAuthState } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch {
        setLoadError("Failed to load profile data");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (
    values: EditProfileValues,
    helpers: FormikHelpers<EditProfileValues>,
  ) => {
    helpers.setStatus(undefined);

    try {
      const updatedUser = await updateMe({ username: values.username.trim() });
      setAuthState(updatedUser);
      router.push("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update profile";
        helpers.setStatus(message);
      } else {
        helpers.setStatus("Failed to update profile");
      }
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Edit Profile</h1>
          <p>{loadError || "Loading..."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <Formik
          initialValues={{ username: user.username }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ status, isSubmitting }) => (
            <Form className={css.profileInfo}>
              <div className={css.usernameWrapper}>
                <label htmlFor="username">Username:</label>
                <Field
                  id="username"
                  type="text"
                  name="username"
                  className={css.input}
                />
              </div>

              <p>Email: {user.email}</p>

              <div className={css.actions}>
                <button
                  type="submit"
                  className={css.saveButton}
                  disabled={isSubmitting}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={css.cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              {status && <p>{status}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
