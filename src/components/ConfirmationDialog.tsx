import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";

export default function ConfirmationDialog({ 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone.",
  triggerText = "Delete",
  confirmText = "Confirm",
  cancelText = "Cancel",
  children 
}: {
  onConfirm: () => void;
  title?: string;
  description?: string;
  triggerText?: string;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="destructive">{triggerText}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelText}
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}