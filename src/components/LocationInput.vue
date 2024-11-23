
<script setup>
  import { ref, computed, defineEmits, onMounted } from 'vue';
  import ArgonInput from "@/components/ArgonInput.vue";
  import TypingHints from "@/components/TypingHints.vue";
  
  const props = defineProps({
		locations: {
			type: Array,
			required: true,
			default: () => [],
		},
  });
  
  const emit = defineEmits(['locationSelected', "typingLocation"]);
  
  const inputText = ref('');
  
	onMounted(() => {
		// 檢查 localStorage 中是否有 Performance
		const performanceData = localStorage.getItem("Performance");

		if (performanceData) {
			try {
				const parsedData = JSON.parse(performanceData);
				if (parsedData.LocationName) {
					inputText.value = parsedData.LocationName; // 設定 inputText 為 Performance 的 LocationName
				}
			} catch (error) {
				console.error("Error parsing Performance data from localStorage:", error);
			}
		}
	});
  const filteredLocations = computed(() => {
		if (!props.locations) return [];
		return props.locations
	  .map(location => location.LocationName)
	  .filter(location => location?.toLowerCase().includes(inputText.value.toLowerCase()));
	});
  
	const typingLocation = (event) => {
		inputText.value = event.target.value;
		emit('typingLocation', inputText.value);
	};
  
  const selectLocation = (location) => {
    inputText.value = location;
		emit('locationSelected', inputText.value);
  };
</script>
<template>
	<div>
	  <label class="form-control-label">輸入場地</label>
	  <argon-input
		v-model="inputText"
		type="text"
		placeholder="請輸入場地名稱"
		@input="typingLocation"
	  />
	  <label class="form-control-label">過往場地</label>
	  <typing-hints
		class="form-control"
		:hints="filteredLocations"
		:inputValue="inputText"
		@selectHint="selectLocation"
	  />
	</div>
</template>
  