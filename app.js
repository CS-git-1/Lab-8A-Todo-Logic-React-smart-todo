$(function () {
    const $taskList = $("#task-list");
    const $taskCount = $("#task-count");
    const $taskForm = $("#task-form");
    const $titleInput = $("#title");
    const $result = $("#result");
    const $resultText = $("#result-text");
    const $undoButton = $("#undo-delete");
    const $priorityInput = $("#task-priority");

    function renderTasks() {
        $taskList.empty();

        const remaining = tasks.filter(task => !task.completed).length;
        $taskCount.text(`${remaining} งานที่ยังไม่เสร็จ`);

        if (tasks.length === 0) {
            $taskList.append(
                $("<li>")
                    .addClass("empty")
                    .text("ยังไม่มีงาน ลองเพิ่มงานแรกของคุณดูนะ")
            );
            return;
        }

        tasks.forEach(task => {
            const $item = $("<li>")
                .addClass("task")
                .toggleClass("completed", task.completed)
                .data("taskId", task.id);

            const $check = $("<button>", {
                class: "check",
                type: "button",
                "aria-label": task.completed ? "ทำเครื่องหมายว่ายังไม่เสร็จ" : "ทำเครื่องหมายว่าเสร็จแล้ว"
            });

            const $title = $("<div>")
                .addClass("task-title")
                .text(task.title);

            const priorityLabels = {
                low: "สำคัญน้อย",
                medium: "สำคัญปานกลาง",
                high: "สำคัญมาก"
            };
            const $priority = $("<span>")
                .addClass("priority")
                .attr("data-priority", task.priority || "medium")
                .text(priorityLabels[task.priority] || task.priority);

            const $info = $("<div>")
                .addClass("task-info")
                .append($title, $priority);

            const $remove = $("<button>", {
                class: "delete-button",
                type: "button",
                "aria-label": `ลบงาน ${task.title}`
            }).text("ลบ");

            $item.append($check, $info, $remove);
            $taskList.append($item);
        });
    }

    function showMessage(message, isError = false) {
        $resultText.text(message);
        $result.toggleClass("error", isError);
    }

    function showOperationResult(successMessage, response) {
        const message = response.ok ? successMessage : response.error;
        const warning = response.ok ? response.warning : "";
        showMessage([message, warning].filter(Boolean).join(" "), !response.ok || Boolean(warning));
    }

    $taskForm.on("submit", function (event) {
        event.preventDefault();
        const response = addTask($titleInput.val(), $priorityInput.val());

        if (!response.ok) {
            showOperationResult("", response);
            $titleInput.trigger("focus");
            return;
        }

        showOperationResult(`เพิ่มงาน “${response.task.title}” แล้ว`, response);
        $undoButton.removeClass("visible");
        $titleInput.val("").trigger("focus");
        renderTasks();
    });

    $taskList.on("click", ".check", function () {
        const taskId = Number($(this).closest(".task").data("taskId"));
        const response = toggleTask(taskId);
        showOperationResult("อัปเดตสถานะงานแล้ว", response);
        renderTasks();
    });

    $taskList.on("click", ".delete-button", function () {
        const taskId = Number($(this).closest(".task").data("taskId"));
        const response = deleteTask(taskId);
        const message = response.ok ? `ลบงาน “${response.task.title}” แล้ว` : "";
        showOperationResult(message, response);
        $undoButton.toggleClass("visible", response.ok);
        renderTasks();
    });

    $undoButton.on("click", function () {
        const response = undoDeleteTask();
        const message = response.ok ? `กู้คืนงาน “${response.task.title}” แล้ว` : "";
        showOperationResult(message, response);
        $undoButton.removeClass("visible");
        renderTasks();
    });

    renderTasks();
    if (storageError) showMessage(storageError, true);
});
