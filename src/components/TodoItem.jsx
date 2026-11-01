const dateFormatter = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export default function TodoItem({ task, onToggle, onDelete, onEdit, priorityLabels }) {
    const dueDateLabel = task.dueDate
        ? dateFormatter.format(new Date(`${task.dueDate}T00:00:00`))
        : "";
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const isOverdue = Boolean(task.dueDate && task.dueDate < today && !task.completed);

    return (
        <li className={`task${task.completed ? " completed" : ""}`}>
            <button
                className="check"
                type="button"
                aria-label={task.completed ? "ทำเครื่องหมายว่ายังไม่เสร็จ" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
                aria-pressed={task.completed}
                onClick={() => onToggle(task.id)}
            />
            <div className="task-info">
                <div className="task-title" onDoubleClick={() => onEdit?.(task)}>{task.title}</div>
                {task.description && <p className="task-description">{task.description}</p>}
                <span className="priority" data-priority={task.priority}>
                    {priorityLabels[task.priority]}
                </span>
                {dueDateLabel && (
                    <span className={`due-date${isOverdue ? " is-overdue" : ""}`}>
                        {isOverdue ? "เลยกำหนด" : "กำหนด"} {dueDateLabel}
                    </span>
                )}
            </div>
            <span className={`status-label ${task.completed ? "status-done" : "status-active"}`}>
                {task.completed ? "Done" : "Active"}
            </span>
            <button
                className="delete-button"
                type="button"
                aria-label={`ลบงาน ${task.title}`}
                onClick={() => onDelete(task.id)}
            >
                ลบ
            </button>
        </li>
    );
}
