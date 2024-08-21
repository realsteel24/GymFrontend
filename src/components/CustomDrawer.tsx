import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

interface DrawerProps {
  buttonTitle: string;
  drawerTitle: string;
  drawerDescription: string;
  children: React.ReactNode;
  type?: "list" | "card";
}

export const CustomDrwer = ({
  buttonTitle,
  drawerTitle,
  drawerDescription,
  children,
  type,
}: DrawerProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  return (
    <>
      {/* Drawer for mobile */}
      <div className="block md:hidden">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">{buttonTitle}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{drawerTitle}</DrawerTitle>
              <DrawerDescription>{drawerDescription}</DrawerDescription>
            </DrawerHeader>
            {children}
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Dialog for desktop */}
      <div className="hidden md:block">
        <Dialog open={desktopOpen} onOpenChange={setDesktopOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{buttonTitle}</Button>
          </DialogTrigger>
          <DialogContent className={type === "list" ? "" : "sm:max-w-[425px]"}>
            <DialogHeader>
              <DialogTitle>{drawerTitle}</DialogTitle>
              <DialogDescription>{drawerDescription}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
