export default function StatCard({ title, items, linkLabel, onLinkClick, selected, onSelect }) {
    const preview = items.slice(0, 4);
    const hasMore = items.length > 4;
    return (
      <div className={`stat-card${selected ? " selected" : ""}`} onClick={onSelect}>
        <div>
          <div className="stat-card-title">{title}</div>
          <div className="stat-card-list">
            {preview.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
            {hasMore && <div>More...</div>}
          </div>
        </div>
        {/* TODO (Firebase): onLinkClick navigates to the full directory page */}
        <div
          className="stat-card-footer"
          onClick={(e) => { e.stopPropagation(); onLinkClick(); }}
        >
          {linkLabel}
        </div>
      </div>
    );
  }