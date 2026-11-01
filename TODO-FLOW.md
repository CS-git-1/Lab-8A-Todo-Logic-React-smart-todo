# Todo Components: Flow and Toggle Check

## Component structure

```text
App (owns tasks state)
├── TodoForm
├── TodoFilter
└── TodoList
    ├── TodoItem
    ├── TodoItem
    └── ...
```

`App` is the only component that changes the task list state. It passes task data and event callbacks down to child components. Children report user actions through callbacks; they do not edit the state directly.

## Data and event flow

1. `App` initializes `tasks` with mock data and keeps it in `useState`.
2. `App` passes the filtered tasks to `TodoList` through the `tasks` prop.
3. `TodoList` maps each task to a `TodoItem`, passing one `task` and the callbacks `onToggle` and `onDelete`.
4. When a user activates the completion button, `TodoItem` calls `onToggle(task.id)`.
5. The callback runs in `App`. It maps over the current tasks and creates a new task object for the matching ID with the opposite `completed` value.
6. React renders again with the updated state, and the item shows its new completion style.

```text
App tasks state
    └── tasks prop ──> TodoList
                          └── task + onToggle ──> TodoItem
                                                     │ click
                          App <── onToggle(task.id) ─┘
                           │
                           └── setTasks creates the next state
```

## Toggle check: two activations

The second starter task has ID `2` and begins with `completed: false`.

| Step | Action | Expected `completed` value for task 2 |
| --- | --- | --- |
| Initial state | Load mock tasks | `false` |
| Toggle once | Click task 2 completion button | `true` |
| Toggle twice | Click the same button again | `false` |

Each click sends the task ID to `App`; the updater only flips the matching task. Other tasks keep their existing values.

## Test result

The code path implements the two toggles as described: `onToggle(task.id)` calls the `App` handler, and the handler changes only the matching task using `!task.completed`. The production build has also been run successfully with `npm run build`.

This is a code-flow check, not a recorded browser click test. To verify manually, run `npm run dev`, click the second task's completion control twice, and confirm its completed styling turns on after the first click and off after the second.

## Scope note

Delete and undo controls are present in the current app, but deletion behavior is outside this toggle exercise and is covered in CP5.
