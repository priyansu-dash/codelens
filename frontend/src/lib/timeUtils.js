/**
 * Returns a human-friendly relative time string.
 * e.g. "just now", "5m ago", "2h ago", "3d ago"
 */
export function formatDistanceToNow(dateInput) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 30) return "just now";
    if (diffMin < 1) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return "yesterday";
    return `${diffDay}d ago`;
}