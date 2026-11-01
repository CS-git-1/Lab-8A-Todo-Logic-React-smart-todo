const filters = [
    { value: "all", label: "ทั้งหมด" },
    { value: "active", label: "ยังไม่เสร็จ" },
    { value: "completed", label: "เสร็จแล้ว" },
];

export default function TodoFilter({
    filterState,
    onFilterChange,
    priorityFilter,
    onPriorityFilterChange,
    searchTerm,
    onSearchChange,
}) {
    return (
        <div className="list-controls">
            <input
                className="search-input"
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="ค้นหางาน..."
                aria-label="ค้นหางานด้วยคำค้น"
            />
            <div className="todo-filters" role="group" aria-label="กรองรายการงาน">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        className={`filter-button${filterState === filter.value ? " is-selected" : ""}`}
                        type="button"
                        aria-pressed={filterState === filter.value}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <label className="priority-filter-field">
                <span>ความสำคัญ</span>
                <select
                    value={priorityFilter}
                    onChange={(event) => onPriorityFilterChange(event.target.value)}
                    aria-label="กรองตามระดับความสำคัญ"
                >
                    <option value="all">ทุกระดับ</option>
                    <option value="high">สูง</option>
                    <option value="medium">กลาง</option>
                    <option value="low">ต่ำ</option>
                </select>
            </label>
        </div>
    );
}
