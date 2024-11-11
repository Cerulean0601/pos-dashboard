<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted } from 'vue';
import { performanceName } from '../../utils/utils';
import ArgonButton from '@/components/ArgonButton.vue';

const props = defineProps({
  show: Boolean,
	dataSize: Number,
	fetchFunction: Function,
});
const emit = defineEmits(['update:show', 'select']);

const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(props.dataSize / itemsPerPage));
const data = ref([]);
const selectPerformance = (performance) => {
	performance.PerformanceName = performanceName(performance.StartTime, performance.LocationName);
  emit('select', performance);
  close();
};

onMounted(async () => {
	const response = await props.fetchFunction();
	data.value = await response.json();
});

watch(currentPage, async() => {
	const response = await props.fetchFunction({ offset: currentPage.value, limit: itemsPerPage });
  data.value = await response.json();
});
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const close = () => {
  emit('update:show', false);
};
</script>
<style>
.list-group-item {
	overflow-y: auto;
}
</style>

<template>
  <div v-if="show" class="modal d-flex align-items-center justify-content-center" style="background: rgba(0, 0, 0, 0.5);" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">選擇表演場次</h5>
        </div>
        <div class="modal-body">
          <ul class="list-group mb-3">
            <li v-for="(item, index) in data" :key="index" class="list-group-item">
              <argon-button 
                class="text-start"
                fullWidth="true"
                @click="selectPerformance(item)">
                {{ performanceName(item.StartTime, item.LocationName) }}
              </argon-button>
					  </li>

          </ul>
          <div class="d-flex justify-content-center">
            <button class="btn btn-primary me-2" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一頁</button>
            <span class="align-self-center">{{ currentPage }} / {{ totalPages }}</span>
            <button class="btn btn-primary ms-2" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一頁</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

