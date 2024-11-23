<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import ArgonButton from "@/components/ArgonButton.vue";
import LocationInput from "@/components/LocationInput.vue";
import { fetchLoactions, fetchAndCache } from '../utils/fetchData';

const store = useStore();

const locations = ref([]);
const inputText = ref('');

const isPerformanceStarted = computed(() =>
  store.getters['performance/isPerformanceStarted']
);

onMounted(async () => {
  try {
    locations.value = await fetchAndCache(fetchLoactions, "Locations");
    if(isPerformanceStarted.value){
      // Restore performance state
      store.dispatch('performance/loadPerformance');
    }
  } catch (error) {
    console.error("Error loading locations or restoring state:", error);
  }
});

const insertLocation = async () => {
  if (!inputText.value) {
    alert("場地名稱不能為空白");
    return;
  }

  if (!locations.value.some(location => location.LocationName === inputText.value)) {
    try {
      const response = await fetch('/api/postgres/location/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ LocationName: inputText.value })
      });

      if (!response.ok) throw new Error('新增場地失敗');
      alert('新增成功');

      inputText.value = '';
      localStorage.removeItem("Locations");
      locations.value = await fetchAndCache(fetchLoactions, "Locations");
    } catch (error) {
      console.error('Error adding location:', error);
      alert('新增場地失敗');
    }
  } else {
    alert("新增地點已存在，請從過往場地中點選");
  }
};

const deleteLocation = async () => {
  const locationToDelete = locations.value.find(
    loc => loc.LocationName === inputText.value.trim()
  );

  if (!locationToDelete) {
    alert("場地不存在於清單中，無法刪除");
    inputText.value = '';
    return;
  }

  try {
    const response = await fetch('/api/postgres/location/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ LocationID: locationToDelete.LocationID })
    });

    if (!response.ok) throw new Error('刪除場地失敗');
    alert('場地已成功刪除');

    inputText.value = '';
    localStorage.removeItem("Locations");
    locations.value = await fetchAndCache(fetchLoactions, "Locations");
  } catch (error) {
    console.error('Error deleting location:', error);
    alert('刪除場地失敗');
  }
};

// Start the performance
const startPerformance = () => {
  const selectedLocation = locations.value.find(
    loc => loc.LocationName === inputText.value
  );

  if (!selectedLocation) {
    alert("請新增擺攤地點或從列表中選擇");
    return;
  }

  store.dispatch('performance/startPerformance', selectedLocation);
};

// End the performance
const endPerformance = () => {
  store.dispatch('performance/endPerformance');
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header pb-0">
            <p class="mb-0">擺攤場地</p>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <location-input
                  :locations="locations"
                  @locationSelected="(location) => inputText = location"
                  @typingLocation="(newLocationName) => inputText = newLocationName"
                />
              </div>
            </div>
            <div v-if="!isPerformanceStarted">
              <argon-button
                class="m-1"
                color="primary"
                size="sm"
                @click="insertLocation"
              >
                新增場地
              </argon-button>
              <argon-button
                class="m-1"
                color="danger"
                size="sm"
                @click="deleteLocation"
              >
                刪除場地
              </argon-button>
              <br />
              <argon-button
                class="m-1"
                color="success"
                size="sm"
                @click="startPerformance"
                :disabled="isPerformanceStarted"
              >
                擺攤開始
              </argon-button>
            </div>
            <div v-else>
              <argon-button
                class="m-1"
                color="danger"
                size="sm"
                @click="endPerformance"
              >
                擺攤結束
              </argon-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
