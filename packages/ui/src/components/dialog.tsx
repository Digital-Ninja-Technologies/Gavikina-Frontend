import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-ink/62 backdrop-blur-md',
      'data-[state=open]:animate-gv-in',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  maxWidth?: number;
  title: string;
}

export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, maxWidth = 1080, title, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6 sm:p-10',
          'focus:outline-none',
          className
        )}
        {...props}
      >
        <div style={{ maxWidth }} className="w-full animate-gv-modal">
          <div className="mb-3.5 flex items-center justify-between gap-5">
            <span className="text-[12.5px] font-medium text-white/80">{title}</span>
            <DialogPrimitive.Close className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-white/22 bg-white/12 text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);
DialogContent.displayName = 'DialogContent';
