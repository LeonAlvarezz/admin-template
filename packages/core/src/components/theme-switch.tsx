import { useTheme } from "../hooks/theme";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme === "dark" ? true : false);

  const handleChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    setEnabled(checked);
  };

  // useEffect(() => { setEnabled(); }, [theme]);

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className="group relative flex h-full w-10 cursor-pointer rounded-full bg-accent dark:bg-accent p-0.5 ease-in-out focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-4"
      />
    </Switch>
  );
}
export default ThemeSwitch;
