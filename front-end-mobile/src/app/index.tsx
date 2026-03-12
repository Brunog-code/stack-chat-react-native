import { Redirect } from "expo-router";
import { useAuth } from "../contexts/auth-context";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function index() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return <LoadingSpinner />;
  }

  return user ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
