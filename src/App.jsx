import { useState } from "react";
import TodoFilter from "./components/TodoFilter.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

const starterTasks = [
    { id: 1, title: "วางแผนงานสำหรับสัปดาห์นี้", priority: "medium", completed: true },
    { id: 2, title: "อ่านหนังสือ React ให้จบบท Hooks", priority: "high", completed: false },
    { id: 3, title: "ออกกำลังกาย 30 นาที", priority: "low", completed: false },
];

const priorityLabels = {
    low: "สำคัญน้อย",
    medium: "สำคัญปานกลาง",
    high: "สำคัญมาก",
};

export default function App() {
    const [tasks, setTasks] = useState(starterTasks);
    const [filter, setFilter] = useState("all");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [lastDeleted, setLastDeleted] = useState(null);

    function showMessage(nextMessage, error = false) {
        setMessage(nextMessage);
        setIsError(error);
    }

    function handleAdd(title, priority) {
        const cleanTitle = typeof title === "string" ? title.trim() : "";
        if (!cleanTitle || cleanTitle.length > 100) {
            showMessage("กรุณากรอกชื่องาน 1–100 ตัวอักษร", true);
            return { ok: false };
        }

        const task = { id: Date.now(), title: cleanTitle, priority, completed: false };
        setTasks((items) => [...items, task]);
        setLastDeleted(null);
        showMessage(`เพิ่มงาน “${cleanTitle}” แล้ว`);
        return { ok: true };
    }

    function handleToggle(id) {
        setTasks((items) => items.map((task) => task.id === id
            ? { ...task, completed: !task.completed }
            : task));
        showMessage("อัปเดตสถานะงานแล้ว");
    }

    function handleDelete(id) {
        const index = tasks.findIndex((task) => task.id === id);
        if (index === -1) return;
        const task = tasks[index];
        setLastDeleted({ task, index });
        setTasks((items) => items.filter((item) => item.id !== id));
        showMessage(`ลบงาน “${task.title}” แล้ว`);
    }

    function handleUndo() {
        if (!lastDeleted) return;
        const { task, index } = lastDeleted;
        setTasks((items) => [...items.slice(0, index), task, ...items.slice(index)]);
        setLastDeleted(null);
        showMessage(`กู้คืนงาน “${task.title}” แล้ว`);
    }

    const visibleTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    return (
        <main className="app">
            <p className="eyebrow">จัดระเบียบวันของคุณ</p>
            <h1>รายการที่ต้องทำ<span aria-hidden="true">.</span></h1>
            <p className="intro">ค่อย ๆ ทำทีละอย่าง แล้ววันนี้จะไปได้ไกลกว่าที่คิด</p>

            <section className="panel" aria-label="จัดการรายการงาน">
                <TodoForm onAddTask={handleAdd} />

                <p className={`form-message${isError ? " error" : ""}`} role="status" aria-live="polite">
                    <span>{message}</span>
                    {lastDeleted && (
                        <button className="undo-button" type="button" onClick={handleUndo}>
                            เลิกทำ
                        </button>
                    )}
                </p>

                <div className="section-head">
                    <h2>งานของฉัน</h2>
                    <span className="count">{tasks.filter((task) => !task.completed).length} งานที่ยังไม่เสร็จ</span>
                </div>
                <TodoFilter filterState={filter} onFilterChange={setFilter} />
                <TodoList
                    tasks={visibleTasks}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    priorityLabels={priorityLabels}
                />
            </section>
        </main>
    );
}
