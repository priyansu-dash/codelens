import { useState, useRef, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "../../lib/timeUtils";
import { LANGUAGE_LABELS } from "../../lib/mockData";

export default function Sidebar({ history, activeId, onSelect, onNew, onDelete, onRename }) {
    const [menuId, setMenuId] = useState(null);
    const menuRef = useRef(null);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef(null);
    const isCommitting = useRef(false);

    // Close menu when clicking outside
    useEffect(() => {
        if (!menuId) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuId]);

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setMenuId((prev) => (prev === id ? null : id));
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setMenuId(null);
        onDelete(id);
    };

    const startRename = (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(item.id);
        setEditValue(item.label || item.first_line || "");
    };

    const commitRename = useCallback(
        (id) => {
            if (isCommitting.current) return;
            isCommitting.current = true;

            const val = editValue.trim();
            if (val) {
                onRename(id, val);
            }
            setEditingId(null);
            setEditValue("");

            requestAnimationFrame(() => {
                isCommitting.current = false;
            });
        },
        [editValue, onRename]
    );

    const cancelRename = () => {
        isCommitting.current = true;
        setEditingId(null);
        setEditValue("");
        requestAnimationFrame(() => {
            isCommitting.current = false;
        });
    };

    const handleKeyDown = (e, id) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commitRename(id);
        } else if (e.key === "Escape") {
            cancelRename();
        }
    };

    const handleClick = (item) => {
        if (editingId === item.id) return;
        onSelect(item);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">
                    <span className="sidebar-logo-icon">{"</>"}</span>
                    CodeLens
                </span>
                <button className="btn-new" onClick={onNew} title="New snippet">
                    +
                </button>
            </div>

            <div className="sidebar-label">History</div>

            <nav className="sidebar-list">
                {history.length === 0 && (
                    <p className="sidebar-empty">No snippets yet. Paste code to start.</p>
                )}
                {history.map((item) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${item.id === activeId ? "active" : ""}`}
                        onClick={() => handleClick(item)}
                        onDoubleClick={(e) => startRename(e, item)}
                        title="Double-click to rename"
                        role="button"
                        tabIndex={0}
                    >
                        <div className="sidebar-item-row">
                            <span className="sidebar-lang">
                                {LANGUAGE_LABELS[item.language] ?? item.language}
                            </span>
                            <div className="sidebar-item-actions">
                                <span className="sidebar-time">
                                    {formatDistanceToNow(item.created_at)}
                                </span>
                                <button
                                    className="sidebar-menu-btn"
                                    onClick={(e) => toggleMenu(e, item.id)}
                                    title="More options"
                                >
                                    ⋯
                                </button>
                            </div>
                        </div>

                        {editingId === item.id ? (
                            <input
                                ref={inputRef}
                                className="sidebar-rename-input"
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                onBlur={() => commitRename(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                maxLength={100}
                            />
                        ) : (
                            <div className="sidebar-first-line">
                                {item.label || item.first_line}
                            </div>
                        )}

                        {menuId === item.id && (
                            <div className="sidebar-dropdown" ref={menuRef}>
                                <button
                                    className="sidebar-dropdown-item delete"
                                    onClick={(e) => handleDelete(e, item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}