const MAX_TITLE_LENGTH = 100;
const STORAGE_KEY = "todo-list.tasks.v1";
const PRIORITIES = ["low", "medium", "high"];
const DEFAULT_TASKS = [
    { id: 1, title: "A", priority: "medium", completed: false },
    { id: 2, title: "B", priority: "medium", completed: false },
    { id: 3, title: "C", priority: "medium", completed: false }
];

const validateTitle = title => {
    if (typeof title !== "string") {
        return { ok: false, error: "ชื่องานต้องเป็นข้อความ" };
    }
    const cleanTitle = title.trim();
    if (!cleanTitle || cleanTitle.length > MAX_TITLE_LENGTH) {
        return { ok: false, error: `กรุณากรอกชื่องาน 1–${MAX_TITLE_LENGTH} ตัวอักษร` };
    }
    return { ok: true, title: cleanTitle };
};

let storageError = "";
const loadTasks = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return DEFAULT_TASKS.map(task => ({ ...task }));

        const parsed = JSON.parse(saved);
        const ids = new Set();
        if (!Array.isArray(parsed)) throw new Error("Invalid task list");

        return parsed.map(task => {
            const titleResult = validateTitle(task?.title);
            if (!task || !titleResult.ok || !Number.isSafeInteger(task.id) ||
                task.id < 1 || task.id >= Number.MAX_SAFE_INTEGER || ids.has(task.id) ||
                typeof task.completed !== "boolean" ||
                (task.priority !== undefined && !PRIORITIES.includes(task.priority))) {
                throw new Error("Invalid task data");
            }
            ids.add(task.id);
            return {
                id: task.id,
                title: titleResult.title,
                priority: task.priority ?? "medium",
                completed: task.completed
            };
        });
    } catch {
        storageError = "โหลดงานที่บันทึกไว้ไม่ได้ กำลังใช้รายการเริ่มต้น การเปลี่ยนแปลงครั้งถัดไปจะบันทึกรายการปัจจุบันแทน";
        return DEFAULT_TASKS.map(task => ({ ...task }));
    }
};

let tasks = loadTasks();
let nextId = tasks.reduce((highest, task) => Math.max(highest, task.id), 0) + 1;
let lastDeleted = null;

const saveTasks = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        storageError = "";
    } catch {
        storageError = "บันทึกงานไม่ได้ การเปลี่ยนแปลงยังอยู่ในหน้านี้ แต่อาจหายเมื่อรีเฟรช";
    }
    return storageError;
};

const addTask = (title, priority = "medium") => {
    const result = validateTitle(title);
    if (!result.ok) return result;
    if (!PRIORITIES.includes(priority)) {
        return { ok: false, error: "ความสำคัญต้องเป็น low, medium หรือ high" };
    }
    if (nextId >= Number.MAX_SAFE_INTEGER) {
        return { ok: false, error: "ไม่สามารถสร้างรหัสงานใหม่ได้" };
    }
    const task = { id: nextId++, title: result.title, priority, completed: false };
    tasks = [...tasks, task];
    const warning = saveTasks();
    return { ok: true, task, warning };
};

const toggleTask = id => {
    const task = tasks.find(task => task.id === id);
    if (!task) return { ok: false, error: "ไม่พบงานนี้" };
    const updatedTask = { ...task, completed: !task.completed };
    tasks = tasks.map(task => task.id === id ? updatedTask : task);
    const warning = saveTasks();
    return { ok: true, task: updatedTask, warning };
};

const deleteTask = id => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return { ok: false, error: "ไม่พบงานนี้" };
    lastDeleted = { task: tasks[index], index };
    tasks = tasks.filter(task => task.id !== id);
    const warning = saveTasks();
    return { ok: true, task: lastDeleted.task, index, warning };
};

// Undo restores the most recently deleted task during this page session.
const undoDeleteTask = () => {
    if (!lastDeleted) return { ok: false, error: "ไม่มีงานให้กู้คืน" };
    const { task, index } = lastDeleted;
    tasks = [...tasks.slice(0, index), task, ...tasks.slice(index)];
    lastDeleted = null;
    const warning = saveTasks();
    return { ok: true, task, warning };
};

// Keep the console demo out of the browser app so opening the page never mutates saved tasks.
if (typeof document === "undefined") {
    console.log("เริ่มต้น:", tasks);

    const addResult = addTask(" D ", "medium");
    console.assert(addResult.ok, "addTask ต้องเพิ่มงานใหม่");
    console.assert(tasks[tasks.length - 1].title === "D", "addTask ต้องตัดช่องว่างหัวท้าย");
    console.log("หลัง addTask:", tasks);

    const countBeforeInvalidAdds = tasks.length;
    console.assert(!addTask(" ", "low").ok, "addTask ต้องปฏิเสธชื่อว่าง");
    console.assert(!addTask("x".repeat(101)).ok, "addTask ต้องปฏิเสธชื่อเกิน 100 ตัวอักษร");
    console.assert(tasks.length === countBeforeInvalidAdds, "ข้อมูลไม่ถูกต้องต้องไม่เพิ่มงาน");

    const firstTask = tasks[0];
    const toggleResult = toggleTask(firstTask.id);
    console.assert(toggleResult.ok && tasks[0].completed === !firstTask.completed,
        "toggleTask ต้องสลับสถานะงานที่ตรงกับ id");
    console.log(`หลัง toggleTask(${firstTask.id}):`, tasks);

    const taskToDelete = tasks[1];
    const deleteResult = deleteTask(taskToDelete.id);
    console.assert(deleteResult.ok && !tasks.some(task => task.id === taskToDelete.id),
        "deleteTask ต้องลบงานที่ตรงกับ id");
    console.log(`หลัง deleteTask(${taskToDelete.id}):`, tasks);
    console.log("ตรวจ console.assert เสร็จแล้ว");
}
