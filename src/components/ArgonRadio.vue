<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
  <div class="form-check">
    <input
      :id="id"
      class="form-check-input"
      type="radio"
      :value="value"
      :name="name"
      :checked="checked"
      @change="emit('update:modelValue', $event.target.value)"
    />
    <label class="custom-control-label" :for="id">
      <slot />
    </label>
  </div>
</template>
