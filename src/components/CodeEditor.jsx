import React, { useState, useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import LanguageSelector from "./LanguageSelector";
import ace from "ace-builds"; // Import ace to configure

// Configure worker path
ace.config.set("basePath", "/");
ace.config.set("workerPath", "/");

const CodeEditor = () => {
  const [code, setCode] = useState("// Try variables here\nlet x = 5;\nconsole.log(x);");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const iframeRef = useRef(null);

  const runCodeLocal = () => {
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow.document;
    document.body.innerHTML = "";
    const script = document.createElement("script");
    script.text = `
      console.log = function(...args) {
        const output = document.createElement("div");
        output.textContent = args.join(" ");
        document.body.appendChild(output);
      };
      try {
        ${code}
      } catch (e) {
        console.log("Error:", e.message);
      }
    `;
    document.body.appendChild(script);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <LanguageSelector language={language} setLanguage={setLanguage} disabled={true} />
      <AceEditor
        mode={language}
        theme="monokai"
        value={code}
        onChange={setCode}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        style={{ width: "100%", height: "200px" }}
      />
      <button onClick={runCodeLocal}>Run Code</button>
      <iframe
        ref={iframeRef}
        title="output"
        style={{ width: "100%", height: "100px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default CodeEditor;