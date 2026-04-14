"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AppRouteLoader } from "@/components/app/app-route-loader";

const ROUTE_LOADING_TIMEOUT_MS = 12_000;

type AppRouteLoadingContextValue = {
  isLoading: boolean;
  startLoading: (targetPathname?: string | null) => void;
  stopLoading: () => void;
};

const AppRouteLoadingContext = createContext<AppRouteLoadingContextValue | null>(null);

export function AppRouteLoadingProvider(props: { children: ReactNode }) {
  const { children } = props;
  const pathname = usePathname();
  const [loadingPathname, setLoadingPathname] = useState<string | null>(null);
  const isLoading = loadingPathname === pathname;

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      return;
    }

    document.documentElement.style.cursor = "progress";
    document.body.style.cursor = "progress";

    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, [isLoading]);

  useEffect(() => {
    if (!loadingPathname) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoadingPathname(null);
    }, ROUTE_LOADING_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loadingPathname]);

  const value = useMemo<AppRouteLoadingContextValue>(
    () => ({
      isLoading,
      startLoading: (targetPathname) => setLoadingPathname(targetPathname ?? pathname),
      stopLoading: () => setLoadingPathname(null),
    }),
    [isLoading, pathname],
  );

  return (
    <AppRouteLoadingContext.Provider value={value}>
      {children}
      {isLoading ? <AppRouteLoader /> : null}
    </AppRouteLoadingContext.Provider>
  );
}

export function useAppRouteLoading() {
  const context = useContext(AppRouteLoadingContext);

  if (!context) {
    throw new Error("useAppRouteLoading must be used within AppRouteLoadingProvider");
  }

  return context;
}

type AppLoadingLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
  };

function getLinkPathname(href: LinkProps["href"]) {
  if (typeof href === "string") {
    return href.split("#", 1)[0]?.split("?", 1)[0] ?? href;
  }

  return href.pathname ?? null;
}

export function AppLoadingLink(props: AppLoadingLinkProps) {
  const { children, onClick, target, href, ...rest } = props;
  const context = useContext(AppRouteLoadingContext);
  const pathname = usePathname();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        (target && target !== "_self")
      ) {
        return;
      }

      const nextPathname = getLinkPathname(href);
      if (nextPathname && nextPathname === pathname) {
        context?.stopLoading();
        return;
      }

      context?.startLoading(nextPathname);
    },
    [context, href, onClick, pathname, target],
  );

  return (
    <Link {...rest} href={href} onClick={handleClick} target={target}>
      {children}
    </Link>
  );
}
