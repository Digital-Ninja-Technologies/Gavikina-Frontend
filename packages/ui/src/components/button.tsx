import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-green text-white hover:bg-green-dark',
        outline: 'bg-white text-navy border border-navy/15 font-medium hover:bg-cream',
        'outline-dark': 'bg-white/5 text-white border border-white/20 hover:border-amber hover:text-amber',
        ink: 'bg-ink text-white hover:bg-navy',
        amber: 'bg-amber text-ink hover:bg-amber-light',
        ghost: 'bg-transparent text-green font-semibold p-0 hover:text-green-dark',
      },
      size: {
        lg: 'px-6.5 py-4 text-[15px] rounded-xl',
        md: 'px-5 py-3.25 text-[13.5px] rounded-[11px]',
        sm: 'px-4 py-2.5 text-[13.5px] rounded-[10px]',
        none: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
