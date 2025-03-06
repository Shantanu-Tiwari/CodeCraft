import { Monaco } from "@monaco-editor/react";

export const THEME_DEFINITONS = {
    "github-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "6e7681" },
            { token: "string", foreground: "a5d6ff" },
            { token: "keyword", foreground: "ff7b72" },
            { token: "number", foreground: "79c0ff" },
            { token: "type", foreground: "ffa657" },
            { token: "class", foreground: "ffa657" },
            { token: "function", foreground: "d2a8ff" },
            { token: "variable", foreground: "ffa657" },
            { token: "operator", foreground: "ff7b72" },
        ],
        colors: {
            "editor.background": "#0d1117",
            "editor.foreground": "#c9d1d9",
            "editor.lineHighlightBackground": "#161b22",
            "editorLineNumber.foreground": "#6e7681",
            "editorIndentGuide.background": "#21262d",
            "editor.selectionBackground": "#264f78",
            "editor.inactiveSelectionBackground": "#264f7855",
        },
    },
    monokai: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "75715E" },
            { token: "string", foreground: "E6DB74" },
            { token: "keyword", foreground: "F92672" },
            { token: "number", foreground: "AE81FF" },
            { token: "type", foreground: "66D9EF" },
            { token: "class", foreground: "A6E22E" },
            { token: "function", foreground: "A6E22E" },
            { token: "variable", foreground: "F8F8F2" },
            { token: "operator", foreground: "F92672" },
        ],
        colors: {
            "editor.background": "#272822",
            "editor.foreground": "#F8F8F2",
            "editorLineNumber.foreground": "#75715E",
            "editor.selectionBackground": "#49483E",
            "editor.lineHighlightBackground": "#3E3D32",
            "editorCursor.foreground": "#F8F8F2",
            "editor.selectionHighlightBackground": "#49483E",
        },
    },
    "solarized-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "586e75" },
            { token: "string", foreground: "2aa198" },
            { token: "keyword", foreground: "859900" },
            { token: "number", foreground: "d33682" },
            { token: "type", foreground: "b58900" },
            { token: "class", foreground: "b58900" },
            { token: "function", foreground: "268bd2" },
            { token: "variable", foreground: "b58900" },
            { token: "operator", foreground: "859900" },
        ],
        colors: {
            "editor.background": "#002b36",
            "editor.foreground": "#839496",
            "editorLineNumber.foreground": "#586e75",
            "editor.selectionBackground": "#073642",
            "editor.lineHighlightBackground": "#073642",
            "editorCursor.foreground": "#839496",
            "editor.selectionHighlightBackground": "#073642",
        },
    },
} as const; // ✅ Ensures the entire object is immutable

// Helper function to define themes in Monaco
export const defineMonacoThemes = (monaco: Monaco) => {
    Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, {
            base: themeData.base as "vs" | "vs-dark" | "hc-black", // ✅ Correct typing
            inherit: themeData.inherit,
            rules: themeData.rules,
            colors: themeData.colors,
        });
    });
};

export const LANGUAGE_CONFIG = {
    javascript: {
        name: "JavaScript",
        extension: ".js",
        monacoLanguage: "javascript",
        defaultCode: `// JavaScript example
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Example usage
console.log(greet("World"));`
    },
    python: {
        name: "Python",
        extension: ".py",
        monacoLanguage: "python",
        defaultCode: `# Python example
def greet(name):
    return f"Hello, {name}!"

# Example usage
print(greet("World"))`
    },
    typescript: {
        name: "TypeScript",
        extension: ".ts",
        monacoLanguage: "typescript",
        defaultCode: `// TypeScript example
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Example usage
console.log(greet("World"));`
    },
};