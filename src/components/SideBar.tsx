import { CircleGauge, Files } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname === href;

  return (
    <div
      className={`flex hover:bg-green-400 dark:hover:bg-lime-300 dark:hover:bg-opacity-10 hover:bg-opacity-10 rounded-lg transition ${
        selected
          ? "dark:text-white text-black"
          : "dark:text-gray-400 text-gray-500"
      } cursor-pointer p-2 pl-8`}
      onClick={() => {
        navigate(href);
      }}
    >
      <div className="pr-2">{icon}</div>
      <div className={`font-bold`}>{title}</div>
    </div>
  );
};

export function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}
export function DashboardIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <CircleGauge />
    </svg>
  );
}

export function ReportsIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <Files />
    </svg>
  );
}
