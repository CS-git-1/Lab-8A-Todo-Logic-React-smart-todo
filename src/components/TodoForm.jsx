export default function TodoForm({ onAddTask }) {
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");
        const priority = formData.get("priority");
        const result = onAddTask(title, priority);

        if (result.ok) event.currentTarget.reset();
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
            <select name="priority" defaultValue="medium" aria-label="ระดับความสำคัญ">
                <option value="low">ความสำคัญต่ำ</option>
                <option value="medium">ความสำคัญกลาง</option>
                <option value="high">ความสำคัญสูง</option>
            </select>
            <button className="add-button" type="submit">＋ เพิ่มงาน</button>
        </form>
    );
}
