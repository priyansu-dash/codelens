import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import CodeEditor from "../components/editor/CodeEditor";
import OutputTabs from "../components/output/OutputTabs";
import { DEFAULT_CODE } from "../lib/mockData";
import api from "../lib/api";

export default function AppPage({ onLogout }) {
    const [history, setHistory] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState(DEFAULT_CODE);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/api/snippets")
            .then(({ data }) => setHistory(data.snippets))
            .catch(() => { });
    }, []);

    const handleSelect = async (item) => {
        setActiveId(item.id);
        setLanguage(item.language);
        setAnalysis(null);
        setError("");

        try {
            const { data } = await api.get(`/api/snippets/${item.id}`);
            setCode(data.code);
            setAnalysis(data.analysis);
        } catch {
            setError("Failed to load snippet.");
        }
    };

    const handleNew = () => {
        setActiveId(null);
        setCode("");
        setAnalysis(null);
        setError("");
    };

    const handleDelete = async (id) => {
        try {
            await api.post(`/api/snippets/${id}/delete`);
            setHistory((prev) => prev.filter((h) => h.id !== id));
            if (activeId === id) {
                setActiveId(null);
                setCode("");
                setAnalysis(null);
                setError("");
            }
        } catch {
            setError("Failed to delete snippet.");
        }
    };

    const handleRename = async (id, newLabel) => {
        try {
            const { data } = await api.post(`/api/snippets/${id}/rename`, { label: newLabel });
            setHistory((prev) =>
                prev.map((h) => (h.id === id ? { ...h, label: data.label } : h))
            );
        } catch (err) {
            console.error('Rename failed:', err.response?.data || err.message);
        }
    };
    const handleAnalyze = async () => {
        if (!code.trim()) return;
        setAnalyzing(true);
        setError("");
        setAnalysis(null);

        try {
            const { data } = await api.post("/api/analyze", { code, language });

            const newItem = {
                id: data.snippetId,
                language: data.language,
                first_line: data.firstLine,
                created_at: data.createdAt,
            };

            setHistory((prev) => {
                const filtered = prev.filter((h) => h.id !== newItem.id);
                return [newItem, ...filtered].slice(0, 10);
            });
            setActiveId(newItem.id);
            setAnalysis(data.analysis);
        } catch (err) {
            setError(err.response?.data?.error ?? "Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const active = activeId ? history.find((h) => h.id === activeId) : null;
    const snippetName = active
        ? (active.label || active.first_line || "").slice(0, 40)
        : null;

    return (
        <div className="app-root">
            <Sidebar
                history={history}
                activeId={activeId}
                onSelect={handleSelect}
                onNew={handleNew}
                onDelete={handleDelete}
                onRename={handleRename}
            />

            <div className="main-area">
                <TopBar
                    language={language}
                    onLanguageChange={setLanguage}
                    snippetName={snippetName}
                    onLogout={onLogout}
                    onAnalyze={handleAnalyze}
                    analyzing={analyzing}
                />

                <div className="work-area">
                    <div className="editor-pane">
                        <CodeEditor value={code} onChange={setCode} language={language} />
                    </div>

                    <div className="output-pane">
                        {error && <div className="analyze-error">{error}</div>}
                        <OutputTabs analysis={analysis} loading={analyzing} />
                    </div>
                </div>
            </div>
        </div>
    );
}