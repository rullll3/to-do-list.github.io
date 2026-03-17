// ===== BODY =====
document.body.style.margin = "0";
document.body.style.height = "100vh";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.fontFamily = "Poppins, sans-serif";
document.body.style.background = "linear-gradient(135deg, #667eea, #764ba2)";

// ===== CONTAINER =====
const app = document.createElement("div");
app.style.backdropFilter = "blur(15px)";
app.style.background = "rgba(255,255,255,0.15)";
app.style.padding = "25px";
app.style.borderRadius = "15px";
app.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
app.style.width = "380px";
app.style.color = "white";
document.body.appendChild(app);

// ===== TITLE =====
const title = document.createElement("h2");
title.innerText = "📝 To Do List";
title.style.textAlign = "center";
title.style.marginBottom = "20px";
app.appendChild(title);

// ===== INPUT GROUP =====
const inputGroup = document.createElement("div");
inputGroup.style.display = "flex";
inputGroup.style.gap = "10px";
app.appendChild(inputGroup);

// INPUT
const input = document.createElement("input");
input.placeholder = "Tambah tugas...";
input.style.flex = "1";
input.style.padding = "10px";
input.style.borderRadius = "8px";
input.style.border = "none";
input.style.outline = "none";
input.style.background = "rgba(255,255,255,0.2)";
input.style.color = "white";
input.style.backdropFilter = "blur(5px)";
inputGroup.appendChild(input);

// BUTTON
const addBtn = document.createElement("button");
addBtn.innerText = "+";
addBtn.style.background = "#00c6ff";
addBtn.style.border = "none";
addBtn.style.color = "white";
addBtn.style.padding = "10px 15px";
addBtn.style.borderRadius = "8px";
addBtn.style.cursor = "pointer";
addBtn.style.transition = "0.3s";
addBtn.onmouseover = () => addBtn.style.background = "#0072ff";
addBtn.onmouseout = () => addBtn.style.background = "#00c6ff";
inputGroup.appendChild(addBtn);

// ===== SEARCH =====
const search = document.createElement("input");
search.placeholder = "🔍 Cari tugas...";
search.style.width = "100%";
search.style.marginTop = "15px";
search.style.padding = "10px";
search.style.borderRadius = "8px";
search.style.border = "none";
search.style.background = "rgba(255,255,255,0.2)";
search.style.color = "white";
app.appendChild(search);

// ===== FILTER =====
const filterGroup = document.createElement("div");
filterGroup.style.display = "flex";
filterGroup.style.marginTop = "10px";
filterGroup.style.gap = "5px";
app.appendChild(filterGroup);

const filters = ["All", "Done", "Pending"];
let currentFilter = "All";

filters.forEach(f => {
    const btn = document.createElement("button");
    btn.innerText = f;
    btn.style.flex = "1";
    btn.style.padding = "8px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.background = "rgba(255,255,255,0.2)";
    btn.style.color = "white";

    btn.addEventListener("click", () => {
        currentFilter = f;
        applyFilter();
    });

    filterGroup.appendChild(btn);
});

// ===== LIST =====
const list = document.createElement("ul");
list.style.listStyle = "none";
list.style.padding = "0";
list.style.marginTop = "15px";
app.appendChild(list);

// ===== STORAGE =====
function saveData() {
    const todos = [];
    document.querySelectorAll("li").forEach(li => {
        todos.push({
            text: li.querySelector("span").innerText,
            done: li.querySelector("input").checked
        });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem("todos")) || [];
    data.forEach(todo => createTask(todo.text, todo.done));
}

// ===== CREATE TASK =====
function createTask(value, done = false) {
    const item = document.createElement("li");
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.alignItems = "center";
    item.style.padding = "10px";
    item.style.borderRadius = "10px";
    item.style.marginBottom = "10px";
    item.style.background = "rgba(255,255,255,0.2)";
    item.style.transition = "0.3s";

    item.onmouseover = () => item.style.transform = "scale(1.02)";
    item.onmouseout = () => item.style.transform = "scale(1)";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;

    const text = document.createElement("span");
    text.innerText = value;

    if (done) {
        text.style.textDecoration = "line-through";
        text.style.opacity = "0.6";
    }

    checkbox.addEventListener("change", () => {
        text.style.textDecoration = checkbox.checked ? "line-through" : "none";
        text.style.opacity = checkbox.checked ? "0.6" : "1";
        saveData();
        applyFilter();
    });

    left.appendChild(checkbox);
    left.appendChild(text);

    const right = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.style.marginRight = "5px";

    editBtn.onclick = () => {
        const newText = prompt("Edit tugas:", text.innerText);
        if (newText) {
            text.innerText = newText;
            saveData();
            applyFilter();
        }
    };

    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";

    delBtn.onclick = () => {
        item.remove();
        saveData();
    };

    right.appendChild(editBtn);
    right.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(right);
    list.appendChild(item);

    saveData();
    applyFilter();
}

// ===== FILTER =====
function applyFilter() {
    const keyword = search.value.toLowerCase();

    document.querySelectorAll("li").forEach(li => {
        const text = li.querySelector("span").innerText.toLowerCase();
        const done = li.querySelector("input").checked;

        let show = true;

        if (currentFilter === "Done" && !done) show = false;
        if (currentFilter === "Pending" && done) show = false;
        if (!text.includes(keyword)) show = false;

        li.style.display = show ? "flex" : "none";
    });
}

// ===== EVENTS =====
addBtn.onclick = () => {
    if (input.value.trim() === "") return;
    createTask(input.value);
    input.value = "";
};

input.addEventListener("keypress", e => {
    if (e.key === "Enter") addBtn.click();
});

search.addEventListener("input", applyFilter);

// ===== INIT =====
loadData();