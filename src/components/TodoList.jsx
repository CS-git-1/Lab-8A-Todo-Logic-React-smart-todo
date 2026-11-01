import TodoItem from "./TodoItem.jsx";

export default function TodoList({ tasks, onToggle, onDelete, onEdit, priorityLabels }) {
    if (tasks.length === 0) {
        return <ul className="todo-list"><li className="empty">ยังไม่มีงาน ลองเพิ่มงานแรกของคุณดูนะ</li></ul>;
    }

    return (
        <ul className="todo-list">
            {tasks.map((task) => (
                <TodoItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    priorityLabels={priorityLabels}
                />
            ))}
        </ul>
    );
}
