import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../libs/cn";

export interface NavItemProps extends ComponentPropsWithoutRef<"a"> {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  action?: ReactNode;
  children?: ReactNode;
  as?: React.ElementType;
}

function NavItemRoot({
  icon,
  label,
  active = false,
  action,
  children,
  className,
  as,
  onClick,
  ...props
}: NavItemProps) {
  const hasAction = Boolean(children || action);
  const Component = as || (hasAction && !props.href ? "div" : "a");

  return (
    <li className="list-none">
      <Component
        data-active={active}
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/80 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2",
          !hasAction &&
            "hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground cursor-pointer",
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="shrink-0 text-base flex items-center justify-center">
            {icon}
          </span>
        )}
        {label && (
          <span className="truncate whitespace-nowrap transition-all duration-150 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0 group-data-[collapsed=true]:hidden">
            {label}
          </span>
        )}
        {action && (
          <span
            className="ml-auto shrink-0 group-data-[collapsed=true]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
          </span>
        )}
        {children}
      </Component>
    </li>
  );
}

function NavItemAction({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "ml-auto shrink-0 group-data-[collapsed=true]:hidden",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </span>
  );
}

export const NavItem = Object.assign(NavItemRoot, {
  Action: NavItemAction,
});

export default NavItem;
