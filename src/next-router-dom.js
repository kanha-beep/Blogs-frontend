"use client";

import NextLink from "next/link";
import { useParams as useNextParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function withStateQuery(to, state) {
  if (!state?.from || typeof to !== "string") {
    return to;
  }

  const [path, query = ""] = to.split("?");
  const params = new URLSearchParams(query);
  params.set("from", state.from);
  const nextQuery = params.toString();

  return nextQuery ? `${path}?${nextQuery}` : path;
}

export function Link({ to, href, ...props }) {
  return <NextLink href={href || to || "/"} {...props} />;
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }

    const href = withStateQuery(to, options.state);

    if (options.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const from = searchParams.get("from");
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  return {
    pathname,
    search: query ? `?${query}` : "",
    hash,
    state: from ? { from } : null,
  };
}

export function useParams() {
  return useNextParams();
}

export function Navigate({ to, replace = false, state }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, replace, state, to]);

  return null;
}
