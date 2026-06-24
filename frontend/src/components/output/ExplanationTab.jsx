export default function ExplanationTab({ data, loading }) {
    if (loading) {
        return (
            <div className="tab-loading">
                <div className="skeleton skeleton-line w-3/4" />
                <div className="skeleton skeleton-line w-full" />
                <div className="skeleton skeleton-line w-5/6" />
                <div className="skeleton skeleton-line w-2/3" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="tab-empty">
                <p>Paste code into the editor and click <strong>Analyze</strong> to see an explanation.</p>
            </div>
        );
    }

    return (
        <div className="tab-content explanation">
            {data.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
            ))}
        </div>
    );
}