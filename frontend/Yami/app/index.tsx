import { useEffect } from "react";
import { useRouter } from "expo-router";
import { authService } from "../lib/auth";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        router.replace("/collections");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      // If there's an error checking auth, default to login
      router.replace("/login");
    }
  };

  // This component won't render since we redirect immediately
  return null;
}
