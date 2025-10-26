import { useContext } from "react";
import { GymNameContext } from "./Gym";

export const useGymNameContext = () => useContext(GymNameContext);
