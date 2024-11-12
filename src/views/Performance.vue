<script setup>
import { ref, onMounted } from 'vue';
import ArgonButton from "@/components/ArgonButton.vue";
import LocationInput from "@/components/LocationInput.vue"; // Import the new LocationInput component
import { fetchLoactions, fetchAndCache } from '../utils/fetchData';
import { performanceName } from '../utils/utils';

const locations = ref([]);
const selectLocationID = ref(null);
const performanceStartTime = ref(null); // Record the performance start time
const elapsedTime = ref(null); // Time elapsed
const isPerformanceStarted = ref(false); // Check if the performance has started
let intervalId = null; // Timer ID

const restorePerformanceState = () => {
  const savedData = JSON.parse(localStorage.getItem("Performance"));
  if (savedData && savedData.StartTime) {
    performanceStartTime.value = new Date(savedData.StartTime);
    selectLocationID.value = savedData.LocationID
    isPerformanceStarted.value = true;
    startElapsedTimeCounter(); // Start the timer
  }
};

onMounted(async () => {
  try {
    locations.value = await fetchAndCache(fetchLoactions, "Locations");
    restorePerformanceState(); // Check and restore performance state
  } catch (error) {
    console.error("Error loading locations:", error);
  }
});

const startElapsedTimeCounter = () => {
  intervalId = setInterval(() => {
    const now = new Date();
    const diff = now - performanceStartTime.value;
    const minutes = Math.floor(diff / 60000);
    const seconds = ((diff % 60000) / 1000).toFixed(0);
    elapsedTime.value = `${minutes}分 ${seconds}秒`;
  }, 1000);
};

const inputText = ref('');

// Function to insert a new location
const insertLocation = async () => {
  if(!inputText.value){
    alert("場地名稱不能為空白");
  }
  else if (inputText.value && !locations.value.map(location => location.LocationName).includes(inputText.value)) {
    try {
      const response = await fetch('/api/postgres/location/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ LocationName: inputText.value }) // Ensure sending an object
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      alert('新增成功');
      selectLocationID.value = data.LocationID;
      inputText.value = ''; // Clear input after adding
      
      // Update locations data
      localStorage.removeItem("Locations");
      locations.value = await fetchAndCache(fetchLoactions, "Locations"); 
      
    } catch (error) {
      console.error('Error pushing changes:', error);
    }
  }
  else{
    alert("新增地點已存在，請從過往場地中點選");
  }
};

// Function to delete a location
const deleteLocation = async () => {
  const locationName = inputText.value.trim();

  // 檢查場地名稱是否為空
  if (!locationName) {
    alert("請輸入要刪除的場地名稱");
    return;
  }

  // 檢查場地是否存在於 locations 清單中
  const locationToDelete = locations.value.find(
    (location) => location.LocationName === locationName
  );

  if (!locationToDelete) {
    alert("場地不存在於清單中，無法刪除");
    return;
  }

  // 呼叫 API 刪除場地
  try {
    const response = await fetch(`/api/postgres/location/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ LocationID: locationToDelete.LocationID })
    });

    if (!response.ok){
      const errorMsg = await response.json()
      throw new Error(errorMsg.error);
    } 
    
    alert('場地已成功刪除');
    
    // 更新 locations 清單並清除當前選取的場地
    localStorage.removeItem("Locations");
    locations.value = await fetchAndCache(fetchLoactions, "Locations");
    selectLocationID.value = null;
    inputText.value = ''; // 清空輸入框
  } catch (error) {
    console.error('Error deleting location:', error);
    alert("無法刪除場地:", error.message);
  }
};

// Function to start the performance
const startPerformance = () => {
  const validLocation = locations.value.find(loc => loc.LocationName === inputText.value);

  if (selectLocationID.value === null || !validLocation) {
    alert("請新增表演地點或從列表中選擇");
    return;
  }

  performanceStartTime.value = new Date();
  isPerformanceStarted.value = true;
  const StartTime = performanceStartTime.value.toISOString();

  fetch("/api/postgres/performance/start", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      LocationID: validLocation.LocationID,
      StartTime: StartTime
    })
  })
  .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json(); // Expected to return PerformanceID
    })
    .then(data => {
      console.log("Performance started!");
      const PerformanceID = data.PerformanceID;
      localStorage.setItem("Performance", JSON.stringify({
        LocationID: validLocation.LocationID,
        LocationName: validLocation.LocationName,
        StartTime: StartTime,
        PerformanceID: PerformanceID,
        performanceName: performanceName(StartTime, validLocation.LocationName)
      }));
      startElapsedTimeCounter();
    })
    .catch(error => {
      console.error('Error sending performance start request:', error);
      performanceStartTime.value = null;
      isPerformanceStarted.value = false;
      selectLocationID.value = null;
      localStorage.removeItem("Performance");
      alert('操作失敗');
    });
};

// Function to end the performance
const endPerformance = () => {
  const performanceData = JSON.parse(localStorage.getItem("Performance"));
  if (!performanceData || !performanceData.PerformanceID) {
    alert("未找到有效的 PerformanceID，無法結束表演");
    return;
  }

  const EndTime = new Date().toISOString();

  fetch("/api/postgres/performance/end", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      PerformanceID: performanceData.PerformanceID,
      EndTime: EndTime
    })
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      console.log("Performance ended");
    })
    .catch(error => {
      console.error('Error sending performance end request:', error);
      alert('操作失敗，無法更新結束時間');
    });

  isPerformanceStarted.value = false;
  selectLocationID.value = null;
  if (intervalId) clearInterval(intervalId); // Stop the timer
  localStorage.removeItem("Performance"); // Clear state from localStorage
  localStorage.removeItem("Locations");
  alert("表演已結束");
};

// Function to handle location selection from the LocationInput component
const selectLocations = (location) => {
  inputText.value = location;

  const selectedLocation = locations.value.find(loc => loc.LocationName === location);
  if (selectedLocation) {
    selectLocationID.value = selectedLocation.LocationID;
  } else {
    throw new Error("Location Name is not found.");
  }
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header pb-0">
            <p class="mb-0">表演場地</p>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <location-input
                  :locations="locations"
                  @locationSelected="selectLocations"
                  @typingLocation="(loc) => {inputText = loc}"
                />
              </div>
            </div>
            <argon-button
              color="primary"
              size="sm"
              @click="insertLocation"
            >
              新增場地
            </argon-button>
            <argon-button
              color="danger"
              size="sm"
              @click="deleteLocation"
            >
              刪除場地
            </argon-button>
            <argon-button
              color="success"
              size="sm"
              @click="startPerformance"
              :disabled="isPerformanceStarted"
            >
              表演開始
            </argon-button>
            <argon-button
              color="danger"
              size="sm"
              v-if="isPerformanceStarted"
              @click="endPerformance"
            >
              表演結束
            </argon-button>
          </div>
        </div>
      </div>
      <div class="col-md-4" v-if="isPerformanceStarted">
        <div class="card">
          <div class="card-header pb-0">
            <p class="mb-0">表演資訊</p>
          </div>
          <div class="card-body">
            <p>表演開始時間：{{ performanceStartTime?.toLocaleString() }}</p>
            <p>表演地點: {{ selectLocationID !== null ? locations.find(loc => loc.LocationID === selectLocationID)?.LocationName : '未選擇' }}</p>
            <p>已進行時間：{{ elapsedTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
