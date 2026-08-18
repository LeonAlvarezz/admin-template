import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../libs/cn";
import type { RenderLinkFn } from "../../types";

export interface NavItemProps extends ComponentPropsWithoutRef<"a"> {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  action?: ReactNode;
  children?: ReactNode;
  as?: React.ElementType;
  renderLink?: RenderLinkFn;
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
  renderLink,
  href,
  ...props
}: NavItemProps) {
  const hasAction = Boolean(children || action);
  const Component = as || (hasAction && !href ? "div" : "a");

  const navClassNames = cn(
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/80 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2",
    !hasAction &&
      "hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground cursor-pointer",
    className,
  );

  const innerContent = (
    <>
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
    </>
  );

  if (renderLink && href) {
    return (
      <li className="list-none">
        {renderLink({
          path: href,
          className: navClassNames,
          active,
          children: innerContent,
        })}
      </li>
    );
  }

  return (
    <li className="list-none">
      <Component
        data-active={active}
        onClick={onClick}
        href={href}
        className={navClassNames}
        {...props}
      >
        {innerContent}
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
