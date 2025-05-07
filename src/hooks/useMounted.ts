import { useEffect, useRef } from "react";

export default function useMounted(callback?: VoidFunction) {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (callback && mountedRef.current) {
      void callback();
    }
  }, []);

  return { isMounted: mountedRef.current };
}
