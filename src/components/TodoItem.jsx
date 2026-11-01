export default function TodoItem({ task, onToggle, onDelete, onEdit, priorityLabels }) {
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
                <span className="priority" data-priority={task.priority}>
                    {priorityLabels[task.priority]}
                </span>
            </div>
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
