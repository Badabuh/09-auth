"use client";

import { getSession, getUser } from "../../lib/api/apiClient";
import { useAuthStore } from "../../lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { setAuthState, clearAuthState } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuthenticated = await getSession();
        if (!isAuthenticated) {
          clearAuthState();
          return;
        }

        const user = await getUser();
        if (user) {
          setAuthState(user);
        } else {
          clearAuthState();
        }
      } catch {
        clearAuthState();
      }
    };
    fetchUser();
  }, [setAuthState, clearAuthState]);

  return children;
};

export default AuthProvider;
