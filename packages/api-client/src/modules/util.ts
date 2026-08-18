/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function stringifyParams(
  params: Record<string, any>,
  arrayFormat: "brackets" | "comma" | "indices" | "repeat" = "brackets"
): string {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (arrayFormat === "comma") {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`);
      } else {
        value.forEach((val, idx) => {
          if (val === undefined || val === null) return;
          let k = key;
          if (arrayFormat === "brackets") k = `${key}[]`;
          else if (arrayFormat === "indices") k = `${key}[${idx}]`;
          parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`);
        });
      }
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subVal]) => {
        if (subVal !== undefined && subVal !== null) {
          parts.push(`${encodeURIComponent(`${key}[${subKey}]`)}=${encodeURIComponent(String(subVal))}`);
        }
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join("&");
}
