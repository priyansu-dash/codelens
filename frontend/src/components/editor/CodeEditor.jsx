import Editor from "@monaco-editor/react";

const MONACO_LANG_MAP = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    java: "java",
    c: "c",
    cpp: "cpp",
    csharp: "csharp",
    ruby: "ruby",
};

export default function CodeEditor({ value, onChange, language }) {
    return (
        <div className="editor-wrapper">
            <Editor
                height="100%"
                language={MONACO_LANG_MAP[language] ?? "plaintext"}
                value={value}
                onChange={(val) => onChange(val ?? "")}
                theme="vs-dark"
                options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    renderLineHighlight: "line",
                    padding: { top: 12, bottom: 12 },
                    tabSize: 4,
                    wordWrap: "on",
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                        verticalScrollbarSize: 6,
                        horizontalScrollbarSize: 6,
                    },
                }}
            />
        </div>
    );
}