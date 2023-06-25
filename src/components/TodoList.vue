<script>
import "vue3-toastify/dist/index.css";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { library } from "@fortawesome/fontawesome-svg-core";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Editor from "@tinymce/tinymce-vue";
import {
  faPenToSquare,
  faCircleCheck,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useI18n } from "vue-i18n";

//-------------------------------------------------------------------------

library.add(faPenToSquare, faCircleCheck, faTrash);

export default {
  name: "TodoList",
  components: {
    VueDatePicker,
    editor: Editor
  },
  setup() {
    const { locale } = useI18n();
    const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });
    const newTodoTitle = ref("");
    const newDate = ref("");
    const newTodoContent = ref("");
    const indexEdit = ref(-1);

    const todosData = JSON.parse(localStorage.getItem("todos")) || [];
    const todos = ref(todosData);

    function addTodo() {
      if (newTodoTitle.value && newTodoContent.value && newDate.value) {
        todos.value.push({
          done: false,
          title: newTodoTitle.value,
          content: newTodoContent.value,
          date: newDate.value
        });
        newTodoTitle.value = "";
        newTodoContent.value = "";
        newDate.value = new Date();
      } else {
        if (locale.value === "en") {
          alert("Please fill all field");
        } else {
          alert("Xin hãy điền toàn bộ các trường");
        }
      }
      saveData();
    }

    function saveTodo() {
      if (newTodoTitle.value && newTodoContent.value && newDate.value) {
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
      } else {
        if (locale.value === "en") {
          alert("Please fill all field");
        } else {
          alert("Xin hãy điền toàn bộ các trường");
        }
      }
      saveData();
    }

    function doneTodo(todo) {
      todo.done = !todo.done;
      saveData();
    }

    function removeTodo(index) {
      if (locale.value === "en") {
        if (window.confirm("Are you sure to want to delete?")) {
          todos.value.splice(index, 1);
          saveData();
        }
      } else {
        if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
          todos.value.splice(index, 1);
          saveData();
        }
      }
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
      toast(`{{ t('message.hello', { msg: ${title} }) }}`, {
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
      notify,
      t
    };
  }
};
</script>

<template>
  <div class="container">
    <form @submit.prevent>
      <div class="d-flex justify-content-between">
        <div>
          <label>{{ t('form.title') }}</label>
          <input v-model="newTodoTitle" class="newTodoTitle mx-2" autocomplete="off" />
        </div>
        <div>
          <button
            v-if="indexEdit === -1"
            @click="addTodo()"
            class="btn btn-success"
          >{{ t('form.add') }}</button>
          <button v-else @click.self="saveTodo()" class="btn btn-success">{{ t('form.save') }}</button>
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

      <VueDatePicker v-model="newDate" :placeholder="t('select-due-date')"></VueDatePicker>
    </form>
    <h2 class="mt-5 mb-3 text-center">{{ t('list') }}</h2>
    <table class="table table-hover">
      <thead class="thead-light">
        <tr>
          <th scope="col">{{ t('table.todo') }}</th>
          <th scope="col">{{ t('table.due-date') }}</th>
          <th scope="col">{{ t('table.status') }}</th>
          <th scope="col" max-witdh="300"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(todo, index) in todos" :key="index" :class="{ done: todo.done }">
          <td>{{ todo.title }}</td>
          <td>{{ new Date(todo.date).toLocaleString() }}</td>
          <td>
            <p v-if="todo.done">{{ t('table.done') }}</p>
            <p
              v-else-if="!todo.done && (new Date(todo.date) <= new Date())"
            >{{ t('table.out-date') }}</p>
            <p v-else>{{ t('table.doing') }}</p>
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
    <h4 v-if="todos.length === 0" class="text-center">{{ t('table.empty') }}</h4>
  </div>
</template>


<style scoped lang="css">
.newTodoTitle {
  max-width: 100%;
}
.group-btn {
  text-align: right;
}
</style>
