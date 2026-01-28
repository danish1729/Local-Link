import { useLocationContext } from "../providers/LocationProvider";

export function useLocation() {
  const { location, loading, error } = useLocationContext();
  return { location, loading, error };
}
