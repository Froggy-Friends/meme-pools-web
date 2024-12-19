import { useCallback, useEffect } from "react";
import { setChainCookie } from "@/actions/chain/actions";
import { Chain } from "@/models/chain";
import * as Sentry from "@sentry/nextjs";

export default function useSetChainCookie(chain: Chain) {
  const setCookie = useCallback(async () => {
    try {
      await setChainCookie(chain);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [chain]);

  useEffect(() => {
    void setCookie();
  }, [chain, setCookie]);
}