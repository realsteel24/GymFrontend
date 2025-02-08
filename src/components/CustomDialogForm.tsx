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

import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { SquarePlus } from "lucide-react";

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
  setIsMobileOpen,
  isMobileOpen,
  mobileFn,
  type,
}: {
  drawerTitle?: string;
  type?: string;
  drawerDescription?: string;
  FormTitle: string;
  FormDescription: string;
  children: React.ReactNode;
  button: React.ReactNode;
  titleButton: string;
  isOpen?: boolean;
  isMobileOpen?: boolean;
  fn?: () => void;
  mobileFn?: () => void;
  setIsOpen?: (value: boolean) => void;
  setIsMobileOpen?: (value: boolean) => void;
}) => {
  return (
    <>
      {/* Drawer for mobile */}
      <div className="block md:hidden ">
        <Drawer open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DrawerTrigger asChild>
            {type === "mini" ? (
              <SquarePlus className="cursor-pointer" />
            ) : (
              <Button variant="outline">{titleButton}</Button>
            )}
          </DrawerTrigger>
          <DrawerContent className="px-4">
            <ScrollArea className="flex-grow overflow-y-auto">
              <DrawerHeader className="text-left">
                <DrawerTitle>{drawerTitle}</DrawerTitle>
                <DrawerDescription>{drawerDescription}</DrawerDescription>
              </DrawerHeader>
              {children}
            </ScrollArea>

            <DrawerFooter className="pt-2">
              {button}
              <DrawerClose asChild>
                <Button variant="outline" size={"sm"} onClick={mobileFn}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Dialog for desktop */}
      <div className="hidden md:block">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {type === "mini" ? (
              <SquarePlus className="cursor-pointer" />
            ) : (
              <Button variant="outline" onClick={fn}>
                {titleButton}
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]  max-h-[80vh] overflow-auto">
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
