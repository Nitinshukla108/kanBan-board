let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    column.appendChild(div);

    div.addEventListener("dragstart", (e) => {
        dragElement = div;
        div.classList.add("dragging");
    });

    div.addEventListener("dragend", () => {
        div.classList.remove("dragging");
    });

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    updateTaskCount();
    return div;
}

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const countDisplay = col.querySelector(".right");
        countDisplay.innerText = tasks.length;

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        updateTaskCount();
    });
}

columns.forEach(addDragEventsOnColumn);

// Modal Logic
const toggleModalButtons = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButtons.addEventListener("click", () => {
    modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    if (taskTitle.trim() !== "") {
        addTask(taskTitle, taskDesc, todo);
        modal.classList.remove("active");
        // Clear inputs
        document.querySelector("#task-title-input").value = "";
        document.querySelector("#task-desc-input").value = "";
    }
});

// Load from LocalStorage
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) {
        Object.keys(saved).forEach(colId => {
            const column = document.getElementById(colId);
            saved[colId].forEach(task => {
                addTask(task.title, task.desc, column);
            });
        });
    }
};


document.querySelector("#search").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".task").forEach(task => {
        const text = task.innerText.toLowerCase();

        if(text.includes(value)){
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});