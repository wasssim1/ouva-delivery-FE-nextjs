import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface CartDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function CartDialog({ isOpen, setIsOpen }: CartDialogProps) {
  const t = useTranslations();
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="text-lg font-semibold">
          {t("pages.cart.title")}
        </DialogTitle>
        <DialogContent title={t("common.close")}>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-center w-full mt-5">
                TODO
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <span className="flex items-center justify-end">
            <button onClick={() => setIsOpen(false)}>
              {t("common.close")}
            </button>
          </span>
        </DialogFooter>
      </Dialog>
    </>
  );
}
