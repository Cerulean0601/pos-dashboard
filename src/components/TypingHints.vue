<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  hints: {
    type: Array,
    default: () => []
  },
  inputValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["selectHint"]);

const handleClick = (hint) => {
  emit("selectHint", hint);
};
</script>

<template>
  <ul v-if="hints.length" class="hints-list">
    <li
      v-for="hint in hints"
      :key="hint"
      @click="handleClick(hint)"
    >
      {{ hint }}
    </li>
  </ul>
</template>

<style scoped>
.hints-list {
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow: auto;
}

.hints-list li {
  padding: 8px;
  cursor: pointer;
}

</style>
