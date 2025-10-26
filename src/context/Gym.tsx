import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGyms } from "@/hooks/";

interface GymNameContextProps {
  gymName: string;
  gymLogo: string;
  loading: boolean;
  isAuthenticated: boolean;
}

export const GymNameContext = createContext<GymNameContextProps>({
  gymName: "",
  loading: true,
  isAuthenticated: false,
  gymLogo: "",
});

export const GymNameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { gymId } = useParams<{ gymId: string }>();
  const { gyms, loading } = useGyms({ gymId: gymId! });
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Memoize gym object to prevent unnecessary lookups
  const gym = useMemo(() => gyms.find((g) => g.id === gymId), [gyms, gymId]);

  // Memoize gymName
  const gymName = useMemo(() => (gym ? gym.name : "STEEL"), [gym]);
  const gymLogo = useMemo(() => (gym ? gym.logo : "STEEL"), [gym]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      gymLogo,
      gymName,
      loading,
      isAuthenticated,
    }),
    [gymName, loading, isAuthenticated]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    const excludedPaths = new Set([
      `/gym/${gymId}/importForm`,
      `/gym/${gymId}/programs`,
      `/gym/${gymId}/batches`,
      `/gym/${gymId}/thankyou`,
    ]);

    if (!excludedPaths.has(location.pathname)) {
      if (!token) {
        navigate("/");
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, gymId]);

  return (
    <GymNameContext.Provider value={contextValue}>
      {children}
    </GymNameContext.Provider>
  );
};
