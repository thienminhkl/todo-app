<script>
export default {
  name: "select-language",
  setup() {
    return {
      locale: "en"
    };
  }
};
</script>

<template>
  <div class="select-language">
    <select v-model="locale" @change="$i18n.locale = locale" class="select">
      <option value="en">{{ $t('en') }}</option>
      <option value="vn">{{ $t('vn') }}</option>
    </select>
  </div>
</template>

<style scoped>
.select-language {
  text-align: end;
}
.select {
  min-width: 150px;
}
</style>
