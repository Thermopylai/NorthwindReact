import { useEffect, useMemo, useState } from "react";
import { NavDropdown } from "react-bootstrap";

const STORAGE_KEY = "theme-preference";

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getSavedPreference = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === "light" || saved === "dark" || saved === "auto") {
    return saved;
  }

  return "auto";
};

const ThemeDropdown = () => {
  const [themePreference, setThemePreference] = useState(getSavedPreference);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = useMemo(() => {
    return themePreference === "auto" ? systemTheme : themePreference;
  }, [themePreference, systemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
    localStorage.setItem(STORAGE_KEY, themePreference);
  }, [resolvedTheme, themePreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const getThemeIcon = () => {
    if (themePreference === "light") {
      return "bi-sun-fill";
    }

    if (themePreference === "dark") {
      return "bi-moon-stars-fill";
    }

    return "bi-circle-half";
  };

  const isActive = (value) => themePreference === value;

  return (
    <NavDropdown
      align="end"
      title={<i className={`bi ${getThemeIcon()}`}></i>}
      id="theme-dropdown"
    >
      <NavDropdown.Item
        active={isActive("light")}
        onClick={() => setThemePreference("light")}
      >
        <i className="bi bi-sun-fill me-2 opacity-75"></i>
        Vaalea
      </NavDropdown.Item>

      <NavDropdown.Item
        active={isActive("dark")}
        onClick={() => setThemePreference("dark")}
      >
        <i className="bi bi-moon-stars-fill me-2 opacity-75"></i>
        Tumma
      </NavDropdown.Item>

      <NavDropdown.Item
        active={isActive("auto")}
        onClick={() => setThemePreference("auto")}
      >
        <i className="bi bi-circle-half me-2 opacity-75"></i>
        Auto
        <span className="ms-2 text-muted">
          ({systemTheme === "dark" ? "järjestelmän tumma" : "järjestelmän vaalea"})
        </span>
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default ThemeDropdown;
