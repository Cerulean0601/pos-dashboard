<script setup>
const emit = defineEmits(["update:modelValue"]);

defineProps({
  size: {
    type: String,
    default: "default",
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
	defaultText: {
		type: String,
		default: "",
	},
  options: {
    type: Array,
    default: () => [],
  }
});

</script>
<template>
  <div class="form-group">
		<select
			:id="id"
			class="form-select"
			:name="name"
			:value="modelValue"
			:required="isRequired"
			@input="emit('update:modelValue', $event.target.value)"
		>
		<option value="" selected class="placeholder">{{ defaultText }}</option>
		<option v-for="(option, index) in options" :key="index" :value="option">
			{{ option }}
		</option>
		</select>
  </div>
</template>
<style>
.placeholder {
  color: #6c757d; /* 或其他顏色 */
}
</style>