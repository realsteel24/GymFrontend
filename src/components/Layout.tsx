import { useNavigate, useParams } from "react-router-dom";
import { Appbar } from "./AppBar";
import { SidebarItem, HomeIcon, DashboardIcon, ReportsIcon } from "./SideBar";
import { Button } from "./ui/button";
import { SUPER_ADMIN } from "@/config";
import { FilePlus } from "lucide-react";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const navigate = useNavigate();
  const { gymId } = useParams<{ gymId: string }>();
  const jwt = localStorage.getItem("token");
  return (
    <div className="">
      <Appbar
        children={
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            size={"sm"}
            variant={"outline"}
          >
            Logout
          </Button>
        }
      />
      <div className="flex ">
        <div className="w-72 min-h-screen pt-28 hidden lg:block bg-gray-100 bg-opacity-80 bg-blur dark:bg-slate-600 dark:bg-blur dark:bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg">
          <div>
            {jwt === SUPER_ADMIN ? (
              <SidebarItem href={"/gym"} icon={<HomeIcon />} title="Home" />
            ) : null}
            <SidebarItem
              href={`/gym/${gymId}/dashboard`}
              icon={<DashboardIcon />}
              title="Dashboard"
            />
            <SidebarItem
              href={`/gym/${gymId}/importForm`}
              icon={<FilePlus />}
              title="Import form"
            />
            <SidebarItem
              href={`/gym/${gymId}/menu`}
              icon={<ReportsIcon />}
              title="Reports"
            />
          </div>
        </div>
        <div className="w-full dark:bg-black bg-white">{children}</div>
      </div>
    </div>
  );
}
