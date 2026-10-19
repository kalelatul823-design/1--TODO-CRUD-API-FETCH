let cl = console.log;

const todoForm = document.getElementById("todoForm");
const todoItemControl = document.getElementById("todoItem");
const list = document.getElementById("list");

const spinner = document.getElementById("spinner");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const BASE_URL =
  "https://student-crud-cc1ef-default-rtdb.asia-southeast1.firebasedatabase.app";

const TODO_URL = `${BASE_URL}/todoFetch.json`;

function snakBar(msg, icon){
  Swal.fire({
    title : msg,
    icon : icon,
    timer : 3000,
  })
}

let state = {
  todoArr: [],
  editId: null,
};

//showspinner
function showSpinner() {
  spinner.classList.remove("d-none");
}

//hidespinner
function hideSpinner() {
  spinner.classList.add("d-none");
}

function resetForm() {
  todoForm.reset();
}

//read
function showUI() {
  showSpinner()
  fetch(TODO_URL, {
    method: "GET",
    body: null,
    headers: {
      "content-type": "application/json",
      Authodrization: "JWT TOKEN",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      cl(data);
      for (const key in data) {
        data[key].id = key;
        state.todoArr.push(data[key]);
        // cl(state.todoArr)
        createTodo(state.todoArr);
      }
    })
    .catch((err) => {
      cl("something went wrong");
    })
    .finally((res)=>{
      hideSpinner()
    })
}

function createTodo(arr) {
  let result = "";
  arr.forEach((ele) => {
    result += `  <li class="list-group-item d-flex justify-content-between" id="${ele.id}">
                    <strong>${ele.todoItem}</strong>
                    <div>
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                        <i onclick="onRemove(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                    </div>
                </li>`;
  });
  list.innerHTML = result;
}

showUI();

//create
function onAddTodo(eve) {
  eve.preventDefault();

  let newObj = {
    todoItem: todoItemControl.value,
  };
  showSpinner();
  fetch(TODO_URL, {
    method: "POST",
    body: JSON.stringify(newObj),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      cl(res);

      newObj.id = res.name;
      state.todoArr.push(newObj);
      cl(state.todoArr);
      let li = document.createElement("li");
      li.id = res.name;
      li.className = `list-group-item d-flex justify-content-between`;
      li.innerHTML = `<strong>${newObj.todoItem}</strong>
                    <div>
                        <i onclick="onEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                        <i onclick="onRemove(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                    </div>`;
      list.append(li);
      snakBar("Todo added successfully")
    })
    .catch((err) => {
      snakBar("someting went wrong");
    })
    .finally((res) => {
      hideSpinner();
      resetForm();
    });
}

//edit
function onEdit(ele) {
  let editId = ele.closest("li").id;
  state.editId = editId;
  let editObj = state.todoArr.find((todo) => todo.id === editId);
  todoItemControl.value = editObj.todoItem;
  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

//update
function onUpdateTodo(eve) {
  let updateId = state.editId;
  let updateUrl = `${BASE_URL}/todoFetch/${updateId}.json`;
  let updateObj = {
    todoItem: todoItemControl.value,
  };
  showSpinner()
  fetch(updateUrl, {
    method: "PATCH",
    body: JSON.stringify(updateObj),
    headers: {
      "content-type": "application/json",
      Authorization: "JWT TOKEN",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      cl(data);
      updateObj.id = updateId;
      let getIndex = state.todoArr.findIndex((todo) => todo.id === updateId);
      state.todoArr[getIndex] = updateObj;
      let updateLi = document.getElementById(updateId);
      updateLi.querySelector("strong").innerText = updateObj.todoItem;
      resetForm();
      updateBtn.classList.add("d-none");
      submitBtn.classList.remove("d-none");
      snakBar("todo updated successfully")
    })
    .catch((err) => {
      snakBar("Somethig went wrong");
    })
    .finally((res)=>{
      hideSpinner()
    })
}

//remove
function onRemove(ele) {
  let removeId = ele.closest("li").id;
  let removeUrl = `${BASE_URL}/todoFetch/${removeId}.json`;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      showSpinner()
      fetch(removeUrl, {
        method: "DELETE",
        body: null,
        headers: {
          "content-type": "application/json",
          Authorization: "JWT TOKEN",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cl(data);
          let deleteIndex = state.todoArr.findIndex(
            (ele) => ele.id === removeId,
          );
          state.todoArr.splice(deleteIndex, 1);
          ele.closest("li").remove();
          snakBar("todo deleted successfully")
        })

        .catch((err) => {
          snakBar("something went wrong");
        })
        .finally((res)=>{
          hideSpinner()
        })
    }
  });
}

todoForm.addEventListener("submit", onAddTodo);
updateBtn.addEventListener("click", onUpdateTodo);
