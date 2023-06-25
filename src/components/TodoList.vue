<template>
  <div class="container">
    <h1 class="text-center my-3">ToDo App</h1>

    <form @submit.prevent="addTodo()">
      <div class="d-flex justify-content-between">
        <div>
          <label>Add title</label>
          <input v-model="newTodoTitle" class="newTodoTitle mx-2" autocomplete="off" required />
        </div>
        <div>
          <button v-if="indexEdit === -1" class="btn btn-success">Add ToDo</button>
          <button v-else @click="saveTodo()" class="btn btn-success">Save</button>
        </div>
      </div>
      <div class="my-2">
        <editor
          v-model="newTodoContent"
          name="newTodoContent"
          api-key="0upo5i8cw8jgx0k5qig2ut5p0b26vozwvlckkrt02m0sqcao"
          :init="{
            height: 400, 
            mobile: {
              menubar: true,
              plugins: 'autosave lists autolink',
              toolbar: 'undo bold italic styles'
            },
            toolbar: true
          }"
        />
      </div>

      <VueDatePicker v-model="newDate" placeholder="Select due date" required></VueDatePicker>
    </form>
    <h2 class="mt-5 mb-3 text-center">ToDo List</h2>
    <table class="table table-hover">
      <thead class="thead-light">
        <tr>
          <th scope="col">Todo</th>
          <th scope="col">Due date</th>
          <th scope="col">Status</th>
          <th scope="col" max-witdh="300"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(todo, index) in todos" :key="index" :class="{ done: todo.done }">
          <td>{{ todo.title }}</td>
          <td>{{ new Date(todo.date).toLocaleString() }}</td>
          <td>
            <p v-if="todo.done">Done</p>
            <p v-else-if="!todo.done && (new Date(todo.date) <= new Date())">Out Date</p>
            <p v-else>Doing</p>
          </td>
          <td class="group-btn">
            <button
              class="btn btn-info btn-sm"
              @click="info(todo, index)"
              :disabled="indexEdit !== -1"
            >
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </button>
            <button
              class="btn mx-2 btn-sm"
              :class="[!todo.done && (new Date(todo.date) <= new Date()) ? 'btn-secondary' : (todo.done ? 'btn-success' : 'btn-warning')]"
              @click="doneTodo(todo)"
              :disabled="indexEdit !== -1"
            >
              <font-awesome-icon :icon="['fas', 'circle-check']" />
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="removeTodo(index)"
              :disabled="indexEdit !== -1"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <h4 v-if="todos.length === 0" class="text-center">Empty list.</h4>
  </div>
</template>

<script>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Editor from "@tinymce/tinymce-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import {
  faPenToSquare,
  faCircleCheck,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

library.add(faPenToSquare, faCircleCheck, faTrash);

export default {
  name: "TodoList",
  components: {
    VueDatePicker,
    editor: Editor
  },
  setup() {
    const newTodoTitle = ref("");
    const newDate = ref("");
    const newTodoContent = ref("");
    const indexEdit = ref(-1);

    const todosData = JSON.parse(localStorage.getItem("todos")) || [];
    const todos = ref(todosData);

    function addTodo() {
      if (newTodoTitle.value) {
        todos.value.push({
          done: false,
          title: newTodoTitle.value,
          content: newTodoContent.value,
          date: newDate.value
        });
        newTodoTitle.value = "";
        newTodoContent.value = "";
        newDate.value = new Date();
      }
      saveData();
    }

    function saveTodo() {
      if (newTodoTitle.value) {
        todos.value[indexEdit.value] = {
          done: todos.value[indexEdit.value].done,
          title: newTodoTitle.value,
          content: newTodoContent.value,
          date: newDate.value
        };
        newTodoTitle.value = "";
        newTodoContent.value = "";
        newDate.value = new Date();
        indexEdit.value = -1;
      }
      saveData();
    }

    function doneTodo(todo) {
      todo.done = !todo.done;
      saveData();
    }

    function removeTodo(index) {
      todos.value.splice(index, 1);
      saveData();
    }

    function saveData() {
      const storageData = JSON.stringify(todos.value);
      localStorage.setItem("todos", storageData);
    }

    function info(todo, i) {
      newTodoTitle.value = todo.title;
      newDate.value = todo.date;
      newTodoContent.value = todo.content;
      indexEdit.value = i;
    }

    const notify = title => {
      toast(`Todo: ${title} has outdate`, {
        autoClose: 1000
      });
    };

    todos.value.map(todo => {
      if (new Date(todo.date) <= new Date() && !todo.done) {
        notify(todo.title);
      }
    });

    return {
      newDate,
      todos,
      indexEdit,
      newTodoTitle,
      newTodoContent,
      info,
      addTodo,
      saveTodo,
      doneTodo,
      removeTodo,
      saveData,
      notify
    };
  }
};
</script>

<style scoped lang="css">
.newTodoTitle {
  max-width: 100%;
}
.group-btn {
  text-align: right;
}
</style>
