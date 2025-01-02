import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "focus:outline-none bg-primary hover:bg-secondary focus:ring-0 font-semibold text-xl py-3 px-4 mr-2 mb-2 w-52 md:w-60 text-white",
        outline:
          "bg-transparent hover:bg-primary focus:ring-0 font-semibold text-white text-xl py-3 px-4 mr-2 mb-2 w-52 md:w-60 border-2 border-primary text-gray-800 hover:text-white",
        ghost:
          "bg-transparent border-2 border-transparent font-semibold text-xl py-3 px-4 mr-2 mb-2 w-52 md:w-60 text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 px-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };