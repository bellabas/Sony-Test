class ToDoListItem {
    constructor(id, value, status) {
        this.id = id;
        this.value = value;
        this.status = status;
    }
}

let toDoItems = [];
let maxId = 0;
const toDoListStorageName = "toDoList";
const maxIdStorageName = "maxId";

const addToDoElement = function () {
    const toDoValueElement = document.getElementById("add-element-value");
    if (toDoValueElement.value !== "") {
        const toDoListItemObj = new ToDoListItem(maxId, toDoValueElement.value, "pending");
        maxId += 1;
        toDoItems.push(toDoListItemObj);
        toDoValueElement.value = "";
    }
};

const markToDoElement = function (id) {
    for (let i = 0; i < toDoItems.length; i++) {
        if (toDoItems[i].id === id) {
            toDoItems[i].status = toDoItems[i].status === "completed" ? "pending" : "completed";
        }
    }
};

const deleteToDoElement = function (id) {
    const result = toDoItems.filter((x) => x.id !== id);
    toDoItems = result;
};

const editToDoElement = function (toDoElement, id) {
    const currentValue = toDoElement.getElementsByClassName("to-do-list-item-value")[0].innerHTML;

    const editDiv = document.createElement("div");
    editDiv.setAttribute("class", "to-do-list-item-edit");

    const editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("value", currentValue);
    editDiv.appendChild(editInput);

    const editCancel = document.createElement("input");
    editCancel.setAttribute("type", "button");
    editCancel.setAttribute("value", "Cancel");
    editCancel.addEventListener("click", () => {
        editDiv.remove();
    });
    editDiv.appendChild(editCancel);

    const editOk = document.createElement("input");
    editOk.setAttribute("type", "button");
    editOk.setAttribute("value", "Ok");
    editOk.addEventListener("click", () => {
        for (let i = 0; i < toDoItems.length; i++) {
            if (toDoItems[i].id === id) {
                toDoItems[i].value = editInput.value;
            }
        }
    });
    editOk.addEventListener("click", saveToLocalStorage);
    editOk.addEventListener("click", renderToDoList);
    editDiv.appendChild(editOk);

    toDoElement.after(editDiv);
};

const saveToLocalStorage = function () {
    localStorage.setItem(toDoListStorageName, JSON.stringify(toDoItems));
    if (toDoItems.length === 0) {
        maxId = 0;
    }
    localStorage.setItem(maxIdStorageName, JSON.stringify(maxId));
};

const loadItemsFromLocalStorage = function () {
    const storedItems = localStorage.getItem(toDoListStorageName);
    if (storedItems === null) {
        toDoItems = [];
        maxId = 0;
    } else {
        toDoItems = JSON.parse(storedItems);
        for (let i = 0; i < toDoItems.length; i++) {
            const element = toDoItems[i];
            toDoItems[i] = new ToDoListItem(element.id, element.value, element.status);
        }
        maxId = parseInt(JSON.parse(localStorage.getItem(maxIdStorageName)));
    }
};

const removeOpenedEditDivs = function () {
    const editDivs = document.getElementsByClassName("to-do-list-item-edit");
    for (let i = 0; i < editDivs.length; i++) {
        editDivs[i].remove();
    }
};

const dragStartToDoItem = function (event, id) {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.dropEffect = "link";
};

const dragOverToDoItem = function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "link";
};

const dropToDoItem = function (event, targetId) {
    event.preventDefault();

    const sourceId = parseInt(event.dataTransfer.getData("text/plain"));
    if (sourceId !== targetId) {
        let sourceIdx = 0;
        let targetIdx = 0;
        for (let i = 0; i < toDoItems.length; i++) {
            if (toDoItems[i].id === sourceId) {
                sourceIdx = i;
            }
            else if (toDoItems[i].id === targetId) {
                targetIdx = i;
            }
        }
        const temp = toDoItems[targetIdx];
        toDoItems[targetIdx] = toDoItems[sourceIdx];
        toDoItems[sourceIdx] = temp;
    }
};

const renderToDoList = function () {
    const toDoListElement = document.getElementById("to-do-list");
    toDoListElement.innerHTML = "";

    for (let i = 0; i < toDoItems.length; i++) {
        const element = toDoItems[i];
        const filter = document.getElementById("to-do-list-filter").value;
        if (filter === "all" || element.status === filter) {
            // main div
            const toDoItemDiv = document.createElement("div");
            toDoItemDiv.setAttribute("class", "to-do-list-item");
            toDoItemDiv.setAttribute("draggable", "true");
            toDoItemDiv.addEventListener("dragstart", (event) => dragStartToDoItem(event, element.id));
            toDoItemDiv.addEventListener("dragover", dragOverToDoItem);
            toDoItemDiv.addEventListener("drop", (event) => dropToDoItem(event, element.id));
            toDoItemDiv.addEventListener("drop", saveToLocalStorage);
            toDoItemDiv.addEventListener("drop", renderToDoList);

            // checkbox
            const toDoItemCheckbox = document.createElement("input");
            toDoItemCheckbox.setAttribute("type", "checkbox");
            if (element.status === "completed") {
                toDoItemCheckbox.checked = true;
                toDoItemDiv.classList.add("task-completed");
            }
            toDoItemCheckbox.addEventListener("click", () => markToDoElement(element.id));
            toDoItemCheckbox.addEventListener("click", saveToLocalStorage);
            toDoItemCheckbox.addEventListener("click", renderToDoList);
            toDoItemDiv.appendChild(toDoItemCheckbox);

            // value
            const toDoItemSpan = document.createElement("span");
            toDoItemSpan.setAttribute("class", "to-do-list-item-value");
            toDoItemSpan.innerHTML = element.value;
            toDoItemDiv.appendChild(toDoItemSpan);

            // edit button
            const toDoItemEdit = document.createElement("input");
            toDoItemEdit.setAttribute("type", "button");
            toDoItemEdit.setAttribute("value", "Edit");
            // remove previously opened edit divs
            toDoItemEdit.addEventListener("click", removeOpenedEditDivs);
            toDoItemEdit.addEventListener("click", () => editToDoElement(toDoItemDiv, element.id));
            toDoItemDiv.appendChild(toDoItemEdit);

            // delete button
            const toDoItemDelete = document.createElement("input");
            toDoItemDelete.setAttribute("type", "button");
            toDoItemDelete.setAttribute("value", "Delete");
            toDoItemDelete.addEventListener("click", () => deleteToDoElement(element.id));
            toDoItemDelete.addEventListener("click", saveToLocalStorage);
            toDoItemDelete.addEventListener("click", renderToDoList);
            toDoItemDiv.appendChild(toDoItemDelete);

            toDoListElement.appendChild(toDoItemDiv);
        }
    }
};

const startup = function () {
    loadItemsFromLocalStorage();
    renderToDoList();

    const addButton = document.getElementById("add-element-button");
    addButton.addEventListener("click", addToDoElement);
    addButton.addEventListener("click", saveToLocalStorage);
    addButton.addEventListener("click", renderToDoList);

    const filterElement = document.getElementById("to-do-list-filter");
    filterElement.addEventListener("change", renderToDoList);
};


window.addEventListener("DOMContentLoaded", startup);