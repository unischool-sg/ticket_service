"use client";

import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinkButtonProps = Omit<LinkProps, "href"> & {
  href: string;
  className?: string;
  children?: ReactNode;
};

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

type Props = LinkButtonProps | NativeButtonProps;

const Button = (props: Props) => {
  if (props.href)
    return (
      <Link
        {...props}
        className={cn(
          `px-5 py-3 border rounded hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-3`,
          props.className,
        )}
        href={props.href}
      >
        {props.children}
      </Link>
    );
  else
    return (
      <button
        {...(props as NativeButtonProps)}
        className={cn(
          `px-5 py-3 border rounded hover:bg-gray-100 cursor-pointer flex flex-row justify-center items-center space-x-3`,
          props.className,
        )}
        type={(props as NativeButtonProps).type || "button"}
      >
        {props.children}
      </button>
    );
};

export default Button;
