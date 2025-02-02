"use client"

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
    "text-[0.8rem] font-medium text-destructive"
)

const ErrorMessage = ({ className, children, ...props }) => (
    <p className={cn(labelVariants(), className)} {...props} >{children}</p>
)

export { ErrorMessage };

