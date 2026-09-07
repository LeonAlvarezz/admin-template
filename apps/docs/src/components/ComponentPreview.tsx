import { Button, cn, Tooltip } from "@z3/admin-core";
import React, { useState } from "react";

export interface ComponentPreviewProps {
  children: React.ReactNode;
  code?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function ComponentPreview({
  children,
  code,
  title,
  description,
  className,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "not-content my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all",
        className,
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-accent/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {title && (
            <span className="font-semibold text-sm text-foreground">
              {title}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">
              ({description})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center rounded-lg bg-accent/40 p-0.5 text-xs">
            <Button
              type="button"
              variant="barebone"
              size="sm"
              onClick={() => setActiveTab("preview")}
              className={`rounded-md px-3 font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preview
            </Button>
            {code && (
              <Button
                type="button"
                variant="barebone"
                size="sm"
                onClick={() => setActiveTab("code")}
                className={`rounded-md px-3 font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Code
              </Button>
            )}
          </div>

          {/* Copy Button */}
          {code && (
            <Tooltip content={copied ? "Copied" : "Copy code"} tabIndex={-1}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="size-7 bg-card text-muted-foreground data-hover:bg-accent data-hover:text-foreground"
                aria-label="Copy code"
              >
                {copied ? (
                  <svg
                    className="size-3.5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Body Area */}
      {activeTab === "preview" ? (
        <div className="flex min-h-[160px] w-full items-center justify-center p-6 sm:p-10 bg-background/50">
          {children}
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#12141c] p-4 text-xs font-mono text-gray-200">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
