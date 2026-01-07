import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export function useUserRole() {
  const { data: session } = useSession();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [session?.user?.id]);

  return { role, loading };
}