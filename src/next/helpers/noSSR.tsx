"use client";

import { ReactNode, useEffect, useState } from "react";

interface NoSSRElementProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function useMounted() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient: typeof window !== "undefined",
    isMounted: isClient,
  };
}

/**
 * Wraps a component to prevent it from rendering on the server side.
 * @param children - The component to wrap.
 * @param fallback - The fallback component to render while the component is loading.
 * @returns The wrapped component.
 */
function NoSSR(props: NoSSRElementProps) {
  const { children, fallback = null } = props;
  const { isMounted, isClient } = useMounted();
  if (!isMounted || !isClient) return fallback;
  return <>{children}</>;
}

export default NoSSR;
