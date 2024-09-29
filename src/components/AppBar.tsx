import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/Admin-Logo.svg";

interface AppbarProps {
  children: React.ReactNode;
}

export const Appbar = ({ children }: AppbarProps) => {
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();

  return (
    <div className="flex justify-between px-4 dark:bg-black backdrop-filter backdrop-blur-3xl">
      <div
        className="text-lg flex flex-col justify-center font-bold"
        onClick={() => navigate(`/gym/${gymId}/dashboard`)}
      >
        <img src={Logo} className="mx-2 h-8 w-8 "></img>
      </div>
      <div className="flex my-4">
        <div className="pt-1 mr-4">
          <DarkModeToggle />
        </div>

        <div className="f">{children}</div>
      </div>
    </div>
  );
};
