import { useQuery } from "@tanstack/react-query";
import { type User, type UserRole } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    hasRole: (role: UserRole) => user?.role === role,
  };
}