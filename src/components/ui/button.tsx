import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] press-effect",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl shadow-[var(--shadow-sm)]",
        outline:
          "border border-border/60 bg-background hover:bg-muted/50 hover:border-primary/30 text-foreground rounded-2xl shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl shadow-[var(--shadow-sm)]",
        ghost:
          "hover:bg-muted/60 hover:text-foreground rounded-2xl",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "gradient-primary text-primary-foreground rounded-2xl shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] press-effect shine-effect font-bold",
        "hero-outline":
          "border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-2xl backdrop-blur-sm font-bold",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
