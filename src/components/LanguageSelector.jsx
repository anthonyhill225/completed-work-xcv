// LanguageSelector.jsx
import React from "react";
import { LANGUAGES } from "./constants";

const LanguageSelector = ({ language, setLanguage, disabled }) => {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      disabled={disabled}
      style={{ padding: "5px", fontSize: "16px" }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;