import { useState } from "react";
import ExplanationTab from "./ExplanationTab";
import ComplexityTab from "./ComplexityTab";
import RefactorTab from "./RefactorTab";

const TABS = [
    { id: "explanation", label: "Explanation" },
    { id: "complexity", label: "Complexity" },
    { id: "refactor", label: "Refactor" },
];

export default function OutputTabs({ analysis, loading }) {
    const [activeTab, setActiveTab] = useState("explanation");

    return (
        <div className="output-panel">
            <div className="tab-bar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-body">
                {activeTab === "explanation" && (
                    <ExplanationTab data={analysis?.explanation} loading={loading} />
                )}
                {activeTab === "complexity" && (
                    <ComplexityTab data={analysis?.complexity} loading={loading} />
                )}
                {activeTab === "refactor" && (
                    <RefactorTab data={analysis?.refactor} loading={loading} />
                )}
            </div>
        </div>
    );
}