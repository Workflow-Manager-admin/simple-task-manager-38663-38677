import React, { useState } from "react";
import "./App.css";
import "./figma_todo_design.css";

/**
 * Modern minimalistic React Todo App using Figma-based design.
 * Features: View, add, edit, delete, mark completed.
 * Style: minimal, light, Figma/Figma_token colors for accent/primary/secondary.
 * See assets/ for original Figma-extracted HTML and CSS.
 */

// --- Figma-based color/theme CSS variables via figma_todo_design.css ---

// PUBLIC_INTERFACE
const TodoApp = () => {
  // Local state for todos
  const [todos, setTodos] = useState([
    // Example dummy todo
    // { id, title, detail, completed }
  ]);
  const [route, setRoute] = useState("list"); // 'list', 'add', 'edit', 'completed'
  const [editTodoId, setEditTodoId] = useState(null);

  // Handlers for View switching
  const showAddForm = () => {
    setEditTodoId(null);
    setRoute("add");
  };
  const showEditForm = (id) => {
    setEditTodoId(id);
    setRoute("edit");
  };
  const showTodoList = () => {
    setRoute("list");
    setEditTodoId(null);
  };
  const showCompletedTodos = () => {
    setRoute("completed");
  };

  // CRUD Logic
  // PUBLIC_INTERFACE
  function addTodo(title, detail) {
    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      detail: detail ? detail.trim() : "",
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setRoute("list");
  }

  // PUBLIC_INTERFACE
  function editTodo(id, newTitle, newDetail) {
    setTodos(todos.map((todo) =>
      todo.id === id
        ? { ...todo, title: newTitle.trim(), detail: newDetail ? newDetail.trim() : "" }
        : todo
    ));
    setRoute("list");
    setEditTodoId(null);
  }

  // PUBLIC_INTERFACE
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // PUBLIC_INTERFACE
  function toggleComplete(id) {
    setTodos(todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  }

  // Routing and rendering logic
  let currentPage;
  if (route === "add") {
    currentPage = (
      <AddEditTodoPage
        mode="add"
        onSave={addTodo}
        onCancel={showTodoList}
      />
    );
  } else if (route === "edit") {
    const todo = todos.find((t) => t.id === editTodoId);
    currentPage = (
      <AddEditTodoPage
        mode="edit"
        todo={todo}
        onSave={(title, detail) => editTodo(todo.id, title, detail)}
        onCancel={showTodoList}
      />
    );
  } else if (route === "completed") {
    currentPage = (
      <CompletedTodosPage
        todos={todos.filter((t) => t.completed)}
        onBack={showTodoList}
      />
    );
  } else {
    // Default: todo list
    currentPage = (
      <TodoListPage
        todos={todos}
        onAdd={showAddForm}
        onStartEdit={showEditForm}
        onDelete={deleteTodo}
        onToggleComplete={toggleComplete}
        onShowCompleted={showCompletedTodos}
      />
    );
  }

  return <div style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>{currentPage}</div>;
};

export default TodoApp;

/**
 * Todo List Page - shows all todos with controls.
 */
function TodoListPage({ todos, onAdd, onStartEdit, onDelete, onToggleComplete, onShowCompleted }) {
  return (
    <div className="figma-container" style={{ background: "var(--color-bg-primary)", minHeight: "100vh" }}>
      <StatusBar />
      <Appbar title="TODO APP" calendarIcon />
      <TodoNavBar onShowCompleted={onShowCompleted} />
      <button className="btn-add-todo" aria-label="Add todo" onClick={onAdd} style={{ position: "fixed", right: 24, bottom: 100 }}>
        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/29e770af-cf92-4274-9529-a8dce7141d52" width="36" height="36" alt="plus" />
      </button>
      <main>
        <div className="todos-list">
          {todos.length === 0 && (
            <div style={{ color: "var(--color-label)", padding: "40px 0", textAlign: "center" }}>No todos yet!</div>
          )}
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={() => onStartEdit(todo.id)}
              onDelete={() => onDelete(todo.id)}
              onToggleComplete={() => onToggleComplete(todo.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/**
 * Figma-like Status Bar (non-functional, purely for visual imitation)
 */
function StatusBar() {
  return <div className="status-bar" />;
}

/**
 * Appbar/Header component for all pages
 */
function Appbar({ title, calendarIcon, onBack }) {
  return (
    <header className="appbar" style={{ background: "var(--color-brand-accent)" }}>
      {onBack && (
        <button className="back-btn" aria-label="Back" style={{ position: "absolute", left: 10, top: 50 }} onClick={onBack}>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ffb06281-e064-47cb-b686-7805264e3ff4" width="25" height="25" alt="Back" />
        </button>
      )}
      <div className="appbar-title typo-headline">{title}</div>
      {calendarIcon && (
        <button className="icon-btn" aria-label="Calendar" style={{ position: "absolute", right: 24, top: 64 }}>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/40c83010-6203-4ae0-ab3c-786d068b8495" alt="calendar" width="32" height="32" />
        </button>
      )}
    </header>
  );
}

/**
 * Tab Navigation bar at the bottom (All/Completed)
 */
function TodoNavBar({ onShowCompleted }) {
  return (
    <nav className="navbar">
      <button className="icon-btn" aria-label="All Tasks">
        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b462f76a-40bf-47a9-94e9-294145bc2e6d" width="18" height="13" alt="Playlist" />
      </button>
      <span className="typo-bar-label">All</span>
      <button className="icon-btn" aria-label="Completed Tasks" onClick={onShowCompleted}>
        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ec24d3cb-0a13-4c83-8e05-d3de40a7bf73" width="18" height="11" alt="Tick" />
      </button>
      <span className="typo-complete-label">Completed</span>
    </nav>
  );
}

/**
 * Single Todo card block styled like Figma
 */
function TodoCard({ todo, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className="todo-card shadow-0" style={{ opacity: todo.completed ? 0.5 : 1 }}>
      <div className="todo-titles">
        <div className="typo-todo-title" style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.title}
        </div>
        <div className="typo-todo-sub" style={{ color: "var(--color-dark)" }}>
          {todo.detail}
        </div>
      </div>
      <div className="todo-toolbar">
        <button className="icon-btn" aria-label={todo.completed ? "Unmark" : "Complete"} onClick={onToggleComplete}>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e166d4cd-2f0c-48bc-b3f3-520dc596d481" width="24" height="24" alt="Check" />
        </button>
        <button className="icon-btn" aria-label="Delete" onClick={onDelete}>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/48b1bbc8-e7e9-4534-a627-0ac64160ea18" width="24" height="24" alt="Trash" />
        </button>
        <button className="icon-btn" aria-label="Edit" onClick={onEdit}>
          <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5ccdf188-bfa5-4702-b083-b003e53ef470" width="24" height="24" alt="Pencil" />
        </button>
      </div>
    </div>
  );
}

/**
 * Add/Edit Todo Page (mode: "add" | "edit")
 * - Uses the same layout as both Add and Edit Figma pages (with Cancel, Add/Update)
 */
function AddEditTodoPage({ mode, todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo ? todo.title : "");
  const [detail, setDetail] = useState(todo ? todo.detail : "");
  return (
    <div className="figma-container" style={{ background: "var(--color-bg-primary)", minHeight: "100vh" }}>
      <StatusBar />
      <Appbar
        title={mode === "add" ? "Add Task" : "Edit Task"}
        onBack={onCancel}
      />
      <main style={{ width: "410px", margin: "0 auto" }}>
        <form
          style={{ padding: "60px 0 0 0" }}
          onSubmit={e => {
            e.preventDefault();
            if (title.trim()) {
              onSave(title, detail);
            }
          }}
        >
          <div>
            <label className="typo-form-label figma-form-label" htmlFor="todo-title">
              Title
            </label>
            <input
              className="figma-input"
              id="todo-title"
              name="title"
              type="text"
              value={title}
              required
              onChange={e => setTitle(e.target.value)}
              maxLength={64}
            />
          </div>
          <div>
            <label className="typo-form-label figma-form-label" htmlFor="todo-detail">
              Detail
            </label>
            <input
              className="figma-input"
              id="todo-detail"
              name="detail"
              type="text"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              maxLength={256}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="figma-form-btn-primary typo-btn" type="submit" style={{ flex: 1 }}>
              {mode === "add" ? "ADD" : "Update"}
            </button>
            {mode === "edit" && (
              <button
                className="figma-form-btn-secondary typo-btn-secondary"
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  background: "#fff",
                  color: "var(--color-dark)",
                  border: "1px solid var(--color-brand-accent)",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * Completed Todos Page
 */
function CompletedTodosPage({ todos, onBack }) {
  return (
    <div className="figma-container" style={{ background: "var(--color-bg-secondary)", minHeight: "100vh" }}>
      <StatusBar />
      <Appbar title="Completed Task" onBack={onBack} />
      <main>
        <div className="todos-list">
          {todos.length === 0 && (
            <div style={{ color: "var(--color-label)", padding: "40px 0", textAlign: "center" }}>No completed todos yet.</div>
          )}
          {todos.map(todo => (
            <div className="todo-card shadow-0" key={todo.id} style={{ opacity: 0.7 }}>
              <div className="todo-titles">
                <div className="typo-todo-title">{todo.title}</div>
                <div className="typo-todo-sub">{todo.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
