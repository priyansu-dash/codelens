import { useState } from "react";

export default function RefactorTab({ data, loading }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    if (loading) {
        return (
            <div className="tab-loading">
                <div className="skeleton skeleton-code" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="tab-empty">
                <p>Refactored code will appear here after you click <strong>Analyze</strong>.</p>
            </div>
        );
    }

    return (
        <div className="tab-content refactor">
            <div className="refactor-header">
                <span className="refactor-label">Suggested refactor</span>
                <button className="btn-copy" onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className="refactor-code"><code>{data}</code></pre>
        </div>
    );
}