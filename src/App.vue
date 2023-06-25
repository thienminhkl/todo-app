<script>
import TodoList from "./components/TodoList.vue";
import SelectLanguage from "./components/SelectLanguage.vue";
//-------------------------------------------------------------------------

export default {
  name: "App",
  components: { TodoList, SelectLanguage }
};
</script>

<template>
  <select-language />
  <h1 class="text-center my-3">{{ $t('app') }}</h1>
  <TodoList />
</template>

