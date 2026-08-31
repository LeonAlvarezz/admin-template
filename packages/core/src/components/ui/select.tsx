import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "../../utils/cn";
import Button from "./button";
import { ChevronDownIcon, CheckIcon, CloseIcon, SpinnerIcon } from "./icons";

export interface SelectOption<T = any> {
  /** Unique value of the option */
  value: T;
  /** Primary label displayed for the option */
  label: ReactNode;
  /** Optional secondary subtitle or description */
  description?: ReactNode;
  /** Optional leading icon for the option */
  icon?: ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional keywords used for search filtering */
  keywords?: string[];
  /** Any custom metadata */
  [key: string]: any;
}

export interface SelectGroup<T = any> {
  /** Group title */
  group: string;
  /** Options in this group */
  options: SelectOption<T>[];
}

export type RawSelectOption<T = any> =
  SelectOption<T> | SelectGroup<T> | string | number;

export interface SelectProps<T = any> {
  /** Current selected value (single or array if multiple) */
  value?: any;
  /** Initial selected value for uncontrolled state */
  defaultValue?: any;
  /** Change callback with new value and matched option(s) */
  onChange?: (value: any, option?: any) => void;
  /** Array of options, grouped options, or primitive strings/numbers */
  options?: RawSelectOption<T>[];
  /** Async function to load or search options dynamically */
  loadOptions?: (
    query: string,
  ) => Promise<Array<SelectOption<T> | SelectGroup<T>>>;
  /** Loading state indicator */
  loading?: boolean;
  /** Alias for loading */
  isLoading?: boolean;
  /** Debounce delay in ms for async loadOptions (default: 250) */
  debounceMs?: number;
  /** Loading text placeholder in dropdown */
  loadingText?: ReactNode;
  /** Text shown when no options match the query */
  emptyText?: ReactNode;
  /** Custom filter function for client-side search */
  filterOption?: (option: SelectOption<T>, query: string) => boolean;
  /** Enables combobox mode: direct typing into the trigger filters options */
  searchable?: boolean;
  /** Search query change callback */
  onSearchChange?: (query: string) => void;
  /** Enables multiple item selection */
  multiple?: boolean;
  /** Shows a clear button (x) when a value is selected */
  clearable?: boolean;
  /** Leading icon inside the select trigger */
  startIcon?: ReactNode;
  /** Trailing icon (defaults to ChevronDown) */
  endIcon?: ReactNode;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Invalid / error state styling */
  invalid?: boolean;
  /** Size variant */
  sizeVariant?: "sm" | "md" | "lg";
  /** Form name attribute */
  name?: string;
  /** ID attribute for the input/trigger */
  id?: string;
  /** Container class name */
  containerClassName?: string;
  /** Trigger input class name */
  className?: string;
  /** Dropdown menu class name */
  dropdownClassName?: string;
  /** Custom render function for option items */
  renderOption?: (
    option: SelectOption<T>,
    state: { selected: boolean; active: boolean; disabled: boolean },
  ) => ReactNode;
  /** Custom render function for selected value in trigger */
  renderValue?: (
    value: any,
    selectedOption: SelectOption<T> | SelectOption<T>[] | null,
  ) => ReactNode;
  /** Custom children for compound options rendering */
  children?: ReactNode;
}

function isGroup<T>(item: RawSelectOption<T>): item is SelectGroup<T> {
  return typeof item === "object" && "group" in item;
}

function normalizeOption<T>(
  item: RawSelectOption<T>,
): SelectOption<T> | SelectGroup<T> {
  if (typeof item === "string" || typeof item === "number") {
    return {
      value: item as unknown as T,
      label: String(item),
    };
  }
  return item;
}

const sizeClasses = {
  sm: "min-h-8 text-xs py-1 px-2.5 gap-1.5",
  md: "min-h-9 text-sm py-1.5 px-3 gap-2",
  lg: "min-h-10 text-base py-2 px-3.5 gap-2.5",
};

const iconSizes = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

export function Select<T = any>({
  value: controlledValue,
  defaultValue,
  onChange,
  options: rawOptions = [],
  loadOptions,
  loading = false,
  isLoading = false,
  debounceMs = 250,
  loadingText = "Loading options...",
  emptyText = "No options found.",
  filterOption,
  searchable = false,
  onSearchChange,
  multiple = false,
  clearable = false,
  startIcon,
  endIcon,
  placeholder = "Select an option...",
  disabled = false,
  invalid = false,
  sizeVariant = "md",
  name,
  id: customId,
  containerClassName,
  className,
  dropdownClassName,
  renderOption,
  renderValue,
  children,
}: SelectProps<T>) {
  const autoId = useId();
  const selectId = customId || autoId;

  // Uncontrolled vs Controlled internal value state
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<any>(
    defaultValue !== undefined ? defaultValue : multiple ? [] : null,
  );
  const currentValue = isControlled ? controlledValue : internalValue;

  // Search query & Async state
  const [query, setQuery] = useState("");
  const [asyncOptions, setAsyncOptions] = useState<Array<
    SelectOption<T> | SelectGroup<T>
  > | null>(null);
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActuallyLoading = loading || isLoading || isAsyncLoading;

  // Normalize static options
  const normalizedOptions = useMemo(() => {
    return rawOptions.map((opt) => normalizeOption<T>(opt));
  }, [rawOptions]);

  // Combined options (async or static)
  const effectiveOptions = useMemo(() => {
    if (loadOptions && asyncOptions !== null) {
      return asyncOptions;
    }
    return normalizedOptions;
  }, [loadOptions, asyncOptions, normalizedOptions]);

  // Flattened list of options for lookup
  const flatOptions = useMemo(() => {
    const list: SelectOption<T>[] = [];
    effectiveOptions.forEach((item) => {
      if (isGroup(item)) {
        list.push(...item.options);
      } else {
        list.push(item);
      }
    });
    return list;
  }, [effectiveOptions]);

  // Find option helper
  const findOption = useCallback(
    (val: any): SelectOption<T> | null => {
      if (val === null || val === undefined) return null;
      if (typeof val === "object" && "value" in val) {
        return val as SelectOption<T>;
      }
      return flatOptions.find((opt) => opt.value === val) ?? null;
    },
    [flatOptions],
  );

  // Selected Option(s) resolution
  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(currentValue)) return [];
      return currentValue
        .map((v) => findOption(v))
        .filter((opt): opt is SelectOption<T> => opt !== null);
    }
    return findOption(currentValue);
  }, [multiple, currentValue, findOption]);

  // Trigger async fetch with debounce
  const fetchAsyncOptions = useCallback(
    (searchQuery: string) => {
      if (!loadOptions) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setIsAsyncLoading(true);
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const res = await loadOptions(searchQuery);
          setAsyncOptions(res.map((r) => normalizeOption<T>(r)));
        } catch (err) {
          console.error("Failed to load select options:", err);
          setAsyncOptions([]);
        } finally {
          setIsAsyncLoading(false);
        }
      }, debounceMs);
    },
    [loadOptions, debounceMs],
  );

  // Initial load for async options
  useEffect(() => {
    if (loadOptions) {
      fetchAsyncOptions("");
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadOptions, fetchAsyncOptions]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (onSearchChange) {
      onSearchChange(newQuery);
    }
    if (loadOptions) {
      fetchAsyncOptions(newQuery);
    }
  };

  // Filter options based on query (if static)
  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || loadOptions) {
      return effectiveOptions;
    }

    const matchOpt = (opt: SelectOption<T>) => {
      if (filterOption) {
        return filterOption(opt, trimmed);
      }
      const labelStr =
        typeof opt.label === "string" ? opt.label : String(opt.value);
      const descStr =
        typeof opt.description === "string" ? opt.description : "";
      const matchLabel = labelStr.toLowerCase().includes(trimmed);
      const matchDesc = descStr.toLowerCase().includes(trimmed);
      const matchKeywords = opt.keywords?.some((k) =>
        k.toLowerCase().includes(trimmed),
      );
      const matchVal = String(opt.value).toLowerCase().includes(trimmed);
      return matchLabel || matchDesc || matchKeywords || matchVal;
    };

    const result: Array<SelectOption<T> | SelectGroup<T>> = [];

    effectiveOptions.forEach((item) => {
      if (isGroup(item)) {
        const matchingChilds = item.options.filter(matchOpt);
        if (matchingChilds.length > 0) {
          result.push({
            group: item.group,
            options: matchingChilds,
          });
        }
      } else if (matchOpt(item)) {
        result.push(item);
      }
    });

    return result;
  }, [effectiveOptions, query, loadOptions, filterOption]);

  const handleChange = (selectedVal: any) => {
    let resolvedVal = selectedVal;
    let resolvedOption: any = null;

    if (multiple) {
      const arr = Array.isArray(selectedVal) ? selectedVal : [selectedVal];
      resolvedVal = arr.map((item) =>
        typeof item === "object" && item !== null && "value" in item
          ? item.value
          : item,
      );
      resolvedOption = resolvedVal.map((v: any) => findOption(v));
    } else {
      resolvedVal =
        typeof selectedVal === "object" &&
        selectedVal !== null &&
        "value" in selectedVal
          ? selectedVal.value
          : selectedVal;
      resolvedOption = findOption(resolvedVal);
    }

    if (!isControlled) {
      setInternalValue(resolvedVal);
    }
    onChange?.(resolvedVal, resolvedOption);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const emptyVal = multiple ? [] : null;
    if (!isControlled) {
      setInternalValue(emptyVal);
    }
    onChange?.(emptyVal, multiple ? [] : null);
    setQuery("");
  };

  const handleRemoveTag = (e: React.MouseEvent, tagValue: any) => {
    e.stopPropagation();
    if (!multiple) return;
    const currentArr = Array.isArray(currentValue) ? currentValue : [];
    const nextArr = currentArr.filter((v) => v !== tagValue);
    if (!isControlled) {
      setInternalValue(nextArr);
    }
    const nextOptions = nextArr.map((v) => findOption(v));
    onChange?.(nextArr, nextOptions);
  };

  const hasValue = multiple
    ? Array.isArray(currentValue) && currentValue.length > 0
    : currentValue !== null &&
      currentValue !== undefined &&
      currentValue !== "";

  // Active leading icon: startIcon prop or selected single option icon
  const activeStartIcon =
    startIcon ||
    (!multiple && (selectedOptions as SelectOption<T> | null)?.icon);

  return (
    <Combobox
      value={currentValue}
      onChange={handleChange}
      multiple={multiple}
      disabled={disabled}
      immediate={searchable}
      onClose={() => setQuery("")}
    >
      <div className={cn("relative w-full", containerClassName)}>
        {searchable ? (
          <div
            className={cn(
              "relative flex w-full items-center rounded-md border border-border text-foreground transition-all input-focus",
              invalid &&
                "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
              disabled && "opacity-50 cursor-not-allowed bg-muted/20",
              sizeClasses[sizeVariant],
              className,
            )}
          >
            {/* Start Icon Slot */}
            {activeStartIcon && (
              <span
                className={cn(
                  "flex items-center text-foreground/60 shrink-0 select-none",
                  iconSizes[sizeVariant],
                )}
              >
                {activeStartIcon}
              </span>
            )}

            {/* Trigger Body: Searchable Input OR Tags */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0 overflow-hidden">
              {multiple &&
              Array.isArray(selectedOptions) &&
              selectedOptions.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1 min-w-0 py-0.5">
                  {selectedOptions.map((opt) => (
                    <span
                      key={String(opt.value)}
                      className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground select-none"
                    >
                      {opt.icon && (
                        <span className="size-3 shrink-0">{opt.icon}</span>
                      )}
                      <span className="truncate max-w-30">
                        {typeof opt.label === "string"
                          ? opt.label
                          : String(opt.value)}
                      </span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveTag(e, opt.value)}
                          className="text-accent-foreground/60 hover:text-accent-foreground cursor-pointer rounded-xs"
                        >
                          <CloseIcon className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : null}

              <ComboboxInput
                id={selectId}
                name={name}
                disabled={disabled}
                placeholder={
                  multiple &&
                  Array.isArray(selectedOptions) &&
                  selectedOptions.length > 0
                    ? ""
                    : placeholder
                }
                displayValue={(val: any) => {
                  if (multiple) return query;
                  if (renderValue) {
                    const custom = renderValue(val, selectedOptions);
                    if (typeof custom === "string") return custom;
                  }
                  const opt = findOption(val);
                  if (opt) {
                    return typeof opt.label === "string"
                      ? opt.label
                      : String(opt.value);
                  }
                  return "";
                }}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="w-full min-w-15 flex-1 bg-transparent text-foreground placeholder:text-foreground/40 outline-none border-0 p-0 focus:outline-none focus:ring-0 select-text"
              />
            </div>

            {/* End Action Slot: Spinner, Clear Button, Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 text-foreground/50">
              {isActuallyLoading && (
                <SpinnerIcon className={iconSizes[sizeVariant]} />
              )}

              {clearable && hasValue && !disabled && (
                <Button
                  variant="barebone"
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear selection"
                  className="text-foreground/40 hover:text-foreground cursor-pointer transition-colors p-0.5 rounded"
                >
                  <CloseIcon className={iconSizes[sizeVariant]} />
                </Button>
              )}

              <ComboboxButton className="flex items-center cursor-pointer hover:text-foreground transition-colors">
                {endIcon || (
                  <ChevronDownIcon className={iconSizes[sizeVariant]} />
                )}
              </ComboboxButton>
            </div>
          </div>
        ) : (
          <ComboboxButton
            as="div"
            disabled={disabled}
            className={cn(
              "relative flex w-full items-center justify-between rounded-md border border-border bg-muted/20 text-foreground transition-all input-focus cursor-pointer select-none",
              invalid &&
                "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
              disabled && "opacity-50 cursor-not-allowed bg-muted/20",
              sizeClasses[sizeVariant],
              className,
            )}
          >
            {/* Start Icon Slot */}
            {activeStartIcon && (
              <span
                className={cn(
                  "flex items-center text-foreground/60 shrink-0 select-none",
                  iconSizes[sizeVariant],
                )}
              >
                {activeStartIcon}
              </span>
            )}

            {/* Trigger Body: Selected Value / Multiple Tags */}
            <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0 overflow-hidden py-0.5">
              {multiple &&
              Array.isArray(selectedOptions) &&
              selectedOptions.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1 min-w-0 py-0.5">
                  {selectedOptions.map((opt) => (
                    <span
                      key={String(opt.value)}
                      className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground select-none"
                    >
                      {opt.icon && (
                        <span className="size-3 shrink-0">{opt.icon}</span>
                      )}
                      <span className="truncate max-w-30">
                        {typeof opt.label === "string"
                          ? opt.label
                          : String(opt.value)}
                      </span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveTag(e, opt.value)}
                          className="text-accent-foreground/60 hover:text-accent-foreground cursor-pointer rounded-xs"
                        >
                          <CloseIcon className="size-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span
                  className={cn(
                    "truncate block",
                    !hasValue && "text-foreground/40",
                  )}
                >
                  {renderValue
                    ? renderValue(currentValue, selectedOptions)
                    : !hasValue
                      ? placeholder
                      : multiple
                        ? `${(selectedOptions as SelectOption<T>[]).length} selected`
                        : ((selectedOptions as SelectOption<T> | null)?.label ??
                          String(currentValue))}
                </span>
              )}
            </div>

            {/* End Action Slot: Spinner, Clear Button, Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 text-foreground/50">
              {isActuallyLoading && (
                <SpinnerIcon className={iconSizes[sizeVariant]} />
              )}

              {clearable && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear selection"
                  className="text-foreground/40 hover:text-foreground cursor-pointer transition-colors p-0.5 rounded"
                >
                  <CloseIcon className={iconSizes[sizeVariant]} />
                </button>
              )}

              <div className="flex items-center">
                {endIcon || (
                  <ChevronDownIcon className={iconSizes[sizeVariant]} />
                )}
              </div>
            </div>
          </ComboboxButton>
        )}

        {/* Dropdown Options List */}
        <ComboboxOptions
          transition
          className={cn(
            "absolute top-full left-0 mt-1 z-50 w-full min-w-full max-h-60 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-xl outline-none",
            "transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 scroll-fade-y",
            dropdownClassName,
          )}
        >
          {children ? (
            children
          ) : (
            <>
              {isActuallyLoading && filteredOptions.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <SpinnerIcon className="size-4" />
                  <span>{loadingText}</span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground select-none">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((item, index) => {
                  if (isGroup(item)) {
                    return (
                      <div key={item.group || index} className="py-1">
                        <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
                          {item.group}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {item.options.map((opt) => (
                            <ComboboxOptionItem
                              key={String(opt.value)}
                              option={opt}
                              renderOption={renderOption}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <ComboboxOptionItem
                      key={String(item.value)}
                      option={item}
                      renderOption={renderOption}
                    />
                  );
                })
              )}
            </>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

function ComboboxOptionItem<T>({
  option,
  renderOption,
}: {
  option: SelectOption<T>;
  renderOption?: (
    option: SelectOption<T>,
    state: { selected: boolean; active: boolean; disabled: boolean },
  ) => ReactNode;
}) {
  return (
    <ComboboxOption
      value={option.value}
      disabled={option.disabled}
      className={cn(
        "group/option relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-popover-foreground outline-none transition-colors",
        "data-focus:bg-accent data-focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
      )}
    >
      {({ selected, focus, disabled }) => {
        if (renderOption) {
          const customNode = renderOption(option, {
            selected,
            active: focus,
            disabled: !!disabled,
          });
          return <>{customNode}</>;
        }

        return (
          <>
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {option.icon && (
                <span className="shrink-0 size-4 flex items-center justify-center text-muted-foreground group-data-focus/option:text-accent-foreground">
                  {option.icon}
                </span>
              )}
              <div className="flex flex-col min-w-0">
                <span className={cn("truncate", selected && "font-semibold")}>
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-muted-foreground group-data-focus/option:text-accent-foreground/70 truncate">
                    {option.description}
                  </span>
                )}
              </div>
            </div>

            <CheckIcon
              className={cn(
                "size-4 shrink-0 text-primary group-data-focus/option:text-accent-foreground",
                selected ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        );
      }}
    </ComboboxOption>
  );
}

export interface SelectOptionProps extends ComponentPropsWithoutRef<
  typeof ComboboxOption
> {}

function SelectOptionWrapper({ className, ...props }: SelectOptionProps) {
  return (
    <ComboboxOption
      className={cn(
        "group/option relative flex cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-popover-foreground outline-none transition-colors",
        "data-focus:bg-accent data-focus:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SelectGroupWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("py-1", className)} {...props} />;
}

function SelectLabelWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none",
        className,
      )}
      {...props}
    />
  );
}

function SelectSeparatorWrapper({
  className,
  ...props
}: ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      className={cn("my-1 border-t border-border/50", className)}
      {...props}
    />
  );
}

export const CompoundSelect = Object.assign(Select, {
  Option: SelectOptionWrapper,
  Group: SelectGroupWrapper,
  Label: SelectLabelWrapper,
  Separator: SelectSeparatorWrapper,
});

export default CompoundSelect;
