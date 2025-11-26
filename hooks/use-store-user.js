import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useStoreUser() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();

  const [userId, setUserId] = useState(null);
  const lastStoredUserIdRef = useRef(null);

  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;

    let aborted = false;

    async function createUser() {
      try {
        // prevent duplicate calls for same user
        if (lastStoredUserIdRef.current === user?.id) return;

        const id = await storeUser();
        if (!aborted) {
          setUserId(id);
          lastStoredUserIdRef.current = user?.id;
        }
      } catch (error) {
        console.error("Failed to store user:", error);
      }
    }

    createUser();

    return () => {
      aborted = true;
      setUserId(null);
    };
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
