const filters = [
    { value: "all", label: "ทั้งหมด" },
    { value: "active", label: "ยังไม่เสร็จ" },
    { value: "completed", label: "เสร็จแล้ว" },
];

export default function TodoFilter({ filterState, onFilterChange }) {
    return (
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
    );
}
