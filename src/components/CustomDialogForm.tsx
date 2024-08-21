import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import React from "react";

export const CustomDialogForm = ({
  FormTitle,
  FormDescription,
  drawerTitle,
  drawerDescription,
  children,
  button,
  titleButton,
  isOpen,
  setIsOpen,
  fn,
}: {
  drawerTitle?: string;
  drawerDescription?: string;
  FormTitle: string;
  FormDescription: string;
  children: React.ReactNode;
  button: React.ReactNode;
  titleButton: string;
  isOpen: boolean;
  fn?: () => void;
  setIsOpen: () => void;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Drawer for mobile */}
      <div className="block md:hidden ">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">{titleButton}</Button>
          </DrawerTrigger>
          <DrawerContent className="px-4">
            <DrawerHeader className="text-left">
              <DrawerTitle>{drawerTitle}</DrawerTitle>
              <DrawerDescription>{drawerDescription}</DrawerDescription>
            </DrawerHeader>
            {children}
            <DrawerFooter className="pt-2">
              {button}
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Dialog for desktop */}
      <div className="hidden md:block">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={fn} variant={"outline"}>
              {titleButton}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{FormTitle}</DialogTitle>
              <DialogDescription>{FormDescription} </DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter>{button}</DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
