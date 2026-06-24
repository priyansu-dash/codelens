import { LANGUAGES, LANGUAGE_LABELS } from "../../lib/mockData";

export default function TopBar({ language, onLanguageChange, snippetName, onLogout, onAnalyze, analyzing }) {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <select
                    className="lang-select"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {LANGUAGE_LABELS[lang]}
                        </option>
                    ))}
                </select>
                {snippetName && (
                    <span className="snippet-name">{snippetName}</span>
                )}
            </div>

            <div className="topbar-right">
                <button
                    className="btn-analyze"
                    onClick={onAnalyze}
                    disabled={analyzing}
                >
                    {analyzing ? (
                        <>
                            <span className="spinner" />
                            Analyzing…
                        </>
                    ) : (
                        "Analyze"
                    )}
                </button>
                <button className="btn-logout" onClick={onLogout} title="Sign out">
                    Sign out
                </button>
            </div>
        </header>
    );
}