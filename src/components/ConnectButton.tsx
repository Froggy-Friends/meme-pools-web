"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAppKitState } from "@reown/appkit/react";
import { useAppKitEvents } from "@reown/appkit/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { loading } = useAppKitState();
  const events = useAppKitEvents();
  const posthog = usePostHog();

  const handleConnect = async () => {
    if (loading) return;
    await open();
  };

  useEffect(() => {
    posthog.capture("app_kit_event", { event: events.data });
  }, [events, posthog]);

  return (
    <>
      <button
        disabled={loading}
        className="flex items-center h-8 w-38 py-2 px-4 rounded-xl bg-primary text-dark text-sm font-proximaNovaBold hover:bg-light-primary active:scale-[0.97] transition"
        onClick={handleConnect}
      >
        Connect
      </button>
    </>
  );
}
