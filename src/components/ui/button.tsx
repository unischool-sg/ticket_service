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
  const baseStyle = `px-6 py-2.5 font-medium rounded transition-colors flex flex-row justify-center items-center space-x-3 border border-black text-black bg-white hover:bg-black hover:text-white active:bg-gray-800`;

  if (props.href)
    return (
      <Link
        {...props}
        className={cn(baseStyle, props.className)}
        href={props.href}
      >
        {props.children}
      </Link>
    );
  else
    return (
      <button
        {...(props as NativeButtonProps)}
        className={cn(baseStyle, props.className)}
        type={(props as NativeButtonProps).type || "button"}
      >
        {props.children}
      </button>
    );
};

export default Button;
