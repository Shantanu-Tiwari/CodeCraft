"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState, useCallback } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor, OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import debounce from 'lodash/debounce';

function EditorPanel() {
    const clerk = useClerk();
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {
        language,
        theme,
        fontSize,
        editor,
        setFontSize,
        setEditor
    } = useCodeEditorStore();

    const mounted = useMounted();

    // Load saved code when language changes
    useEffect(() => {
        try {
            if (!editor || !isEditorReady) return;

            const savedCode = localStorage.getItem(`editor-code-${language}`);
            const newCode = savedCode || LANGUAGE_CONFIG[language]?.defaultCode || '';
            editor.setValue(newCode);
        } catch (error) {
            console.error('Error loading saved code:', error);
        }
    }, [language, editor, isEditorReady]);

    // Load saved font size
    useEffect(() => {
        try {
            const savedFontSize = localStorage.getItem("editor-font-size");
            if (savedFontSize) {
                const parsedSize = parseInt(savedFontSize);
                if (!isNaN(parsedSize)) {
                    setFontSize(parsedSize);
                }
            }
        } catch (error) {
            console.error('Error loading font size:', error);
        }
    }, [setFontSize]);

    const handleRefresh = useCallback(() => {
        try {
            if (!editor) return;

            const defaultCode = LANGUAGE_CONFIG[language]?.defaultCode || '';
            editor.setValue(defaultCode);
            localStorage.removeItem(`editor-code-${language}`);
        } catch (error) {
            console.error('Error refreshing editor:', error);
        }
    }, [editor, language]);

    // Debounced save function
    const debouncedSave = useCallback(
        debounce((value: string) => {
            try {
                localStorage.setItem(`editor-code-${language}`, value);
            } catch (error) {
                console.error('Error saving code:', error);
            }
        }, 1000),
        [language]
    );

    const handleEditorChange = useCallback((value: string | undefined) => {
        if (value) {
            debouncedSave(value);
        }
    }, [debouncedSave]);

    const handleFontSizeChange = useCallback((newSize: number) => {
        try {
            const size = Math.min(Math.max(newSize, 12), 24);
            setFontSize(size);
            localStorage.setItem("editor-font-size", size.toString());
        } catch (error) {
            console.error('Error changing font size:', error);
        }
    }, [setFontSize]);

    const handleEditorMount: OnMount = useCallback((editor) => {
        setEditor(editor);
        setIsEditorReady(true);
    }, [setEditor]);

    // Cleanup debounced save on unmount
    useEffect(() => {
        return () => {
            debouncedSave.cancel();
        };
    }, [debouncedSave]);

    if (!mounted) return null;

    return (
        <div className="relative">
            <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
                            <Image
                                src={`/${language}.png`}
                                alt={`${language} logo`}
                                width={24}
                                height={24}
                            />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium text-white">Code Editor</h2>
                            <p className="text-xs text-gray-500">Write and execute your code</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Font Size Slider */}
                        <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
                            <TypeIcon className="size-4 text-gray-400" />
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="12"
                                    max="24"
                                    value={fontSize}
                                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                                    className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                                    {fontSize}
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
                            aria-label="Reset to default code"
                        >
                            <RotateCcwIcon className="size-4 text-gray-400" />
                        </motion.button>

                        {/* Share Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsShareDialogOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
                                from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
                        >
                            <ShareIcon className="size-4 text-white" />
                            <span className="text-sm font-medium text-white">Share</span>
                        </motion.button>
                    </div>
                </div>

                {/* Editor */}
                <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
                    {clerk.loaded && (
                        <Editor
                            height="600px"
                            language={LANGUAGE_CONFIG[language]?.monacoLanguage}
                            onChange={handleEditorChange}
                            theme={theme}
                            beforeMount={defineMonacoThemes}
                            onMount={handleEditorMount}
                            options={{
                                minimap: { enabled: false },
                                fontSize,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                padding: { top: 16, bottom: 16 },
                                renderWhitespace: "selection",
                                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                                fontLigatures: true,
                                cursorBlinking: "smooth",
                                smoothScrolling: true,
                                contextmenu: true,
                                renderLineHighlight: "all",
                                lineHeight: 1.6,
                                letterSpacing: 0.5,
                                roundedSelection: true,
                                scrollbar: {
                                    verticalScrollbarSize: 8,
                                    horizontalScrollbarSize: 8,
                                },
                            }}
                        />
                    )}

                    {!clerk.loaded && <EditorPanelSkeleton />}
                </div>
            </div>
            {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
        </div>
    );
}

export default EditorPanel;