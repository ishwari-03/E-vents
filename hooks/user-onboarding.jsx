"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConvexQuery, useConvexMutation } from "./use-convex-query";
import { api } from "@/convex/_generated/api";

const ATTENDEE_PAGES = ["/", "/explore", "/events", "/my-tickets", "/profile"];

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: currentUser, isLoading } =
    useConvexQuery(api.users.getCurrentUser);

  const completeOnboarding = useConvexMutation(api.users.completeOnboarding);

  useEffect(() => {
    if (isLoading || !currentUser) return;

    if (!currentUser.hasCompletedOnboarding) {
      const requires = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page)
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (requires) setShowOnboarding(true);
    }
  }, [currentUser, pathname, isLoading]);

  const handleOnboardingComplete = async (payload) => {
   await completeOnboarding({
  location: {
    city: location.city || null,   // city optional
    state: location.state,
    country: location.country,
  },
  interests: selectedInterests,
});

    setShowOnboarding(false);
    router.refresh();
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    router.refresh();
  };

  return {
    showOnboarding,
    setShowOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
  };
}
