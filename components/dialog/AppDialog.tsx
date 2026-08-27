import {
  type FormEvent,
  type ReactNode,
  useState,
  cloneElement,
  isValidElement,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ReusableDialogProps {
  /** The trigger element that opens the dialog (e.g. <Button>Open</Button>) */
  trigger: ReactNode;
  /** Dialog title */
  title: string;
  /** Optional description shown below the title */
  description?: string;
  /** Form fields / content to render inside the dialog */
  children: ReactNode;
  /** Called when the form is submitted */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /** Label for the submit button */
  submitLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state change handler */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS classes for the dialog content */
  className?: string;
  /** Whether to close the dialog after form submission (default: true) */
  closeOnSubmit?: boolean;
}


export function RDialog({
  trigger,
  title,
  description,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className = "max-w-5xl border border-amber-400",
}: ReusableDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };




  const renderTrigger = () => {
    if (isValidElement(trigger)) {
      return trigger;
    }
    return <Button variant="outline">{String(trigger)}</Button>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        {renderTrigger()}
      </DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {children}
        {/*  <DialogFooter>
            <DialogClose >
              <Button variant="outline" type="button">
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter> */}

      </DialogContent>
    </Dialog>
  );
}