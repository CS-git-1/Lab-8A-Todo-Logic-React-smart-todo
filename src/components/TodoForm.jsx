export default function TodoForm({ onAddTask }) {
    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const result = onAddTask({
            title: formData.get("title"),
            description: formData.get("description"),
            priority: formData.get("priority"),
            dueDate: formData.get("dueDate"),
        });

        if (result.ok) form.reset();
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                name="title"
                type="text"
                placeholder="เพิ่มงานใหม่..."
                maxLength={100}
                aria-label="ชื่องาน"
                required
            />
            <input
                name="description"
                type="text"
                placeholder="รายละเอียดสั้น ๆ (ไม่บังคับ)"
                maxLength={240}
                aria-label="รายละเอียดงาน"
            />
            <select name="priority" defaultValue="medium" aria-label="ระดับความสำคัญ">
                <option value="low">ความสำคัญต่ำ</option>
                <option value="medium">ความสำคัญกลาง</option>
                <option value="high">ความสำคัญสูง</option>
            </select>
            <label className="due-date-field">
                <span>กำหนดเสร็จ</span>
                <input name="dueDate" type="date" aria-label="วันที่ควรเสร็จ" />
            </label>
            <button className="add-button" type="submit">＋ เพิ่มงาน</button>
        </form>
    );
}
