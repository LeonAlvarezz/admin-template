import * as React from "react";
import { useTheme } from "../../hooks/theme";
import { Toaster as ReactToast, toast } from "react-hot-toast";
import type { ToasterProps } from "react-hot-toast";

const TOAST_EDGE_GAP = 16;

export type ViewportBounds = {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

function getViewportToastOffset(
  viewport: ViewportBounds | null | undefined = null,
  layoutViewport: ViewportSize = { width: 0, height: 0 },
  gap = TOAST_EDGE_GAP,
) {
  if (!viewport) {
    return {
      top: gap,
      right: gap,
      bottom: gap,
      left: gap,
    };
  }

  const topInset = Math.max(0, viewport.offsetTop);
  const leftInset = Math.max(0, viewport.offsetLeft);
  const rightInset = Math.max(
    0,
    layoutViewport.width - viewport.width - viewport.offsetLeft,
  );
  const bottomInset = Math.max(
    0,
    layoutViewport.height - viewport.height - viewport.offsetTop,
  );

  return {
    top: topInset + gap,
    right: rightInset + gap,
    bottom: bottomInset + gap,
    left: leftInset + gap,
  };
}

const Toaster = ({ position = "top-center", ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  const [viewportOffset, setViewportOffset] = React.useState(() =>
    getViewportToastOffset(),
  );

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncViewportOffset = () => {
      const viewport = window.visualViewport;

      setViewportOffset(
        getViewportToastOffset(
          viewport
            ? {
                width: viewport.width,
                height: viewport.height,
                offsetTop: viewport.offsetTop,
                offsetLeft: viewport.offsetLeft,
              }
            : null,
          {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        ),
      );
    };

    syncViewportOffset();

    const viewport = window.visualViewport;

    window.addEventListener("resize", syncViewportOffset);
    viewport?.addEventListener("resize", syncViewportOffset);
    viewport?.addEventListener("scroll", syncViewportOffset);

    return () => {
      window.removeEventListener("resize", syncViewportOffset);
      viewport?.removeEventListener("resize", syncViewportOffset);
      viewport?.removeEventListener("scroll", syncViewportOffset);
    };
  }, []);

  return (
    <ReactToast
      position={position}
      {...props}
    />
  );
};

export { Toaster, toast };
