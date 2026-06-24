export default function ComplexityTab({ data, loading }) {
    if (loading) {
        return (
            <div className="tab-loading">
                <div className="skeleton skeleton-pill w-24" />
                <div className="skeleton skeleton-pill w-24" />
                <div className="skeleton skeleton-line w-full mt-4" />
                <div className="skeleton skeleton-line w-5/6" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="tab-empty">
                <p>Complexity analysis will appear here after you click <strong>Analyze</strong>.</p>
            </div>
        );
    }

    return (
        <div className="tab-content complexity">
            <div className="complexity-badges">
                <div className="complexity-badge">
                    <span className="badge-label">Time</span>
                    <span className="badge-value">{data.time}</span>
                </div>
                <div className="complexity-badge">
                    <span className="badge-label">Space</span>
                    <span className="badge-value">{data.space}</span>
                </div>
            </div>

            <div className="complexity-notes">
                {data.notes.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                ))}
            </div>
        </div>
    );
}