import { useState } from "react";
import TodoFilter from "./components/TodoFilter.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

const starterTasks = [
    { id: "task-1", title: "วางแผนงานสำหรับสัปดาห์นี้", description: "สรุปสิ่งที่ต้องทำและจัดลำดับก่อนเริ่มงาน", priority: "medium", dueDate: "2026-11-04", completed: true, createdAt: 1793350800000, updatedAt: 1793435400000 },
    { id: "task-2", title: "อ่านหนังสือ React ให้จบบท Hooks", description: "อ่านและจดสรุป useState กับ useEffect", priority: "high", dueDate: "2026-11-03", completed: false, createdAt: 1793351700000, updatedAt: 1793351700000 },
    { id: "task-3", title: "ออกกำลังกาย 30 นาที", description: "เดินเร็วหรือวิ่งเบา ๆ", priority: "low", dueDate: "2026-11-05", completed: false, createdAt: 1793352600000, updatedAt: 1793352600000 },
];

const priorityLabels = {
    low: "สำคัญน้อย",
    medium: "สำคัญปานกลาง",
    high: "สำคัญมาก",
};

const allowedPriorities = ["low", "medium", "high"];

function isValidDateString(value) {
    if (value === null || value === "") return true;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function createUniqueTaskId(existingIds) {
    let id = crypto.randomUUID();
    while (existingIds.has(id)) id = crypto.randomUUID();
    return id;
}

export default function App() {
    const [tasks, setTasks] = useState(starterTasks);
    const [filter, setFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [lastDeleted, setLastDeleted] = useState(null);

    function showMessage(nextMessage, error = false) {
        setMessage(nextMessage);
        setIsError(error);
    }

    function handleAdd({ title, description, priority, dueDate }) {
        const cleanTitle = typeof title === "string" ? title.trim() : "";
        if (!cleanTitle || cleanTitle.length > 100) {
            showMessage("กรุณากรอกชื่องาน 1–100 ตัวอักษร", true);
            return { ok: false };
        }
        if (!allowedPriorities.includes(priority)) {
            showMessage("priority ต้องเป็น low, medium หรือ high", true);
            return { ok: false };
        }
        if (typeof description !== "string") {
            showMessage("description ต้องเป็นข้อความ", true);
            return { ok: false };
        }
        if (!isValidDateString(dueDate)) {
            showMessage("dueDate ต้องเป็นวันที่รูปแบบ YYYY-MM-DD หรือเว้นว่าง", true);
            return { ok: false };
        }

        const now = Date.now();
        const existingIds = new Set(tasks.map((task) => task.id));
        const task = {
            id: createUniqueTaskId(existingIds),
            title: cleanTitle,
            description: typeof description === "string" ? description.trim() : "",
            priority,
            dueDate: dueDate || null,
            completed: false,
            createdAt: now,
            updatedAt: now,
        };
        setTasks((items) => [...items, task]);
        setLastDeleted(null);
        showMessage(`เพิ่มงาน “${cleanTitle}” แล้ว`);
        return { ok: true };
    }

    function handleToggle(id) {
        setTasks((items) => items.map((task) => task.id === id
            ? { ...task, completed: !task.completed, updatedAt: Date.now() }
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
        const matchesStatus = filter === "active"
            ? task.completed === false
            : filter === "completed"
                ? task.completed
                : true;
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        const query = searchTerm.trim().toLocaleLowerCase();
        const matchesSearch = !query || [task.title, task.description]
            .some((value) => value?.toLocaleLowerCase().includes(query));
        return matchesStatus && matchesPriority && matchesSearch;
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
                    <span className="count">{visibleTasks.length} รายการที่ตรงเงื่อนไข</span>
                </div>
                <TodoFilter
                    filterState={filter}
                    onFilterChange={setFilter}
                    priorityFilter={priorityFilter}
                    onPriorityFilterChange={setPriorityFilter}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
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
