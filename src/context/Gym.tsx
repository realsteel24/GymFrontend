import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGyms } from "@/hooks/";

interface GymNameContextProps {
  gymName: string;
  loading: boolean;
  isAuthenticated: boolean;
}

const GymNameContext = createContext<GymNameContextProps>({
  gymName: "",
  loading: true,
  isAuthenticated: false,
});

export const GymNameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { gymId } = useParams<{ gymId: string }>();
  const { gyms, loading } = useGyms();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const gym = gyms.find((gym) => gym.id === gymId);
  const gymName = gym ? gym.name : "STEEL";
  console.log(gymId, gymName);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const excludedPaths = [
      `/gym/${gymId}/importForm`,
      `/gym/${gymId}/programs`,
      `/gym/${gymId}/batches`,
    ];

    const isExcludedPath = excludedPaths.some((path) =>
      location.pathname.includes(path)
    );

    if (!isExcludedPath) {
      if (!token) {
        navigate("/");
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, location.pathname, gymId]);

  return (
    <GymNameContext.Provider value={{ gymName, loading, isAuthenticated }}>
      {children}
    </GymNameContext.Provider>
  );
};

export const useGymNameContext = () => useContext(GymNameContext);
