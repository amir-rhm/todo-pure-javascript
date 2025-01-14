"use strict"

// variables
const todoInput = document.querySelector(".todo__input")
const todoAddButton = document.querySelector(".todo__add")
const todoEditButton = document.querySelector(".todo__edit")
const tableBody = document.querySelector(".table__body")
const btnClearTodos = document.querySelector(".btn__clear-todos")
const table = document.querySelector(".table")
const todoList = getTodoFromLocalStorage()

const createTodo = ({ id, title }) => {
    return `
    <tr class="table__row" data-id="${id}">
        <td>
            <p class="todo__id">${id}</p>
        </td>
        <td>
            <p class="todo__title">${title}</p>
        </td>
        <td>
            <button class="btn todo__edit__btn" title="edit ${title}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn todo__remove__btn" title="remove ${title}"><i class="fa-solid fa-trash"></i></button>
        </td>
    </tr>`
                                      }
const showTodos = () => {
  tableBody.innerHTML = todoList.length ? todoList.map(todo => createTodo(todo)).join("") : `<tr> <td colspan="3"> <p>there is no todo.</p> </td> </tr>`
}

const setTodoToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todoList))
}

function getTodoFromLocalStorage() {
  return JSON.parse(localStorage.getItem("todos")) ?? []
}

const clearInput = () => (todoInput.value = "")

const addTodoHandler = () => {
  const todoValue = todoInput.value.trim()
  if (!todoValue) {
    alert("input is empty")
    return
  }

  clearInput()

  // for clear there is no todo
  const todoListLength = todoList.length
  if (todoListLength === 0) tableBody.innerHTML = ""

  const newTodoObj = { id: Date.now(), title: todoValue }
  todoList.push(newTodoObj)

  setTodoToLocalStorage()

  // for add single todo realTime to ui
  const singleTodoElement = createTodo(newTodoObj)
  tableBody.insertAdjacentHTML("beforeend", singleTodoElement)
}

const clearTodos = () => {
  if (!confirm("clear todos ? ")) return
  localStorage.clear("todos")
  todoList.length = 0
  showTodos()
}

const toggleButtonVisibility = () => {
  todoAddButton.hidden = !todoAddButton.hidden
  todoEditButton.hidden = !todoEditButton.hidden
}

const todoEditHandler = (todoElement, todoId) => {
  const todoTitleElement = todoElement.querySelector(".todo__title")
  todoInput.value = todoTitleElement.textContent

  toggleButtonVisibility()

  const doEditHandler = () => {
    const todoEditValue = todoInput.value.trim()
    if (!todoEditValue) {
      alert("edit input is empty")
      return
    }
    todoInput.value = ""
    const todoItemInTodoList = todoList.find(todo => +todo["id"] === +todoId)
    todoItemInTodoList["title"] = todoEditValue
    setTodoToLocalStorage()

    toggleButtonVisibility()
    todoTitleElement.textContent = todoEditValue

    todoEditButton.removeEventListener("click", doEditHandler)
  }

  todoEditButton.addEventListener("click", doEditHandler)
}

const todoDeleteHandler = (todoElement, todoId) => {
  const todoTitleElement = todoElement.querySelector(".todo__title")
  if (!confirm(`remove ${todoTitleElement.textContent} todo ?`)) return
  const todoIdInTodoList = todoList.findIndex(todo => +todo["id"] === +todoId)
  todoList.splice(todoIdInTodoList, 1)
  todoElement.remove()

  if (tableBody.children.length === 0) showTodos()

  setTodoToLocalStorage()
}

const tableButtonsHandler = event => {
  const targetElement = event.target

  // khodesham mide
  const isButton = targetElement.closest("button")
  if (!isButton) return

  const todoRow = targetElement.closest("tr")
  const todoId = todoRow.dataset.id

  if (isButton.classList.contains("todo__edit__btn")) {
    todoEditHandler(todoRow, todoId)
    return
  }

  if (isButton.classList.contains("todo__remove__btn")) todoDeleteHandler(todoRow, todoId)
}

const startApp = () => {
  showTodos()
}
// events
window.addEventListener("load", startApp)
todoAddButton.addEventListener("click", addTodoHandler)
btnClearTodos.addEventListener("click", clearTodos)
table.addEventListener("click", tableButtonsHandler)
// todoInput.addEventListener("keyup", e => {
//   if (e.keyCode === 13) addTodoHandler()
// })
