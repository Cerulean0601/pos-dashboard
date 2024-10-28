<script setup>
import { ref, computed, onMounted } from 'vue';
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import TypingHints from "@/components/TypingHints.vue";
import { fetchLoactions } from '../utils/fetchData';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const locations = ref([]);
const selectLocationID = ref(null);
const performanceStartTime = ref(null); // 紀錄表演開始時間
const elapsedTime = ref(null); // 已進行時間
const isPerformanceStarted = ref(false); // 判斷表演是否已開始
let intervalId = null; // 計時器的 ID

const restorePerformanceState = () => {
  const savedData = JSON.parse(localStorage.getItem("Performance"));
  if (savedData && savedData.StartTime) {
    performanceStartTime.value = new Date(savedData.StartTime);
    isPerformanceStarted.value = true;
    startElapsedTimeCounter(); // 開始計時器
  }
};

onMounted(async () => {
  try {
    locations.value = await fetchLoactions();
    restorePerformanceState(); // 檢查並恢復表演狀態
  } catch (error) {
    console.error("加載地點時出錯:", error);
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
const filteredLocations = computed(() =>
  locations.value.map(location => location.LocationName)
    .filter(location => location?.toLowerCase().includes(inputText.value.toLowerCase()))
);

const insertLocation = async () => {
  if (inputText.value && !locations.value.map(location => location.LocationName).includes(inputText.value)) {
    try {
      const response = await fetch('/api/postgres/location/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ LocationName: inputText.value }) // 確保傳送的是對象
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      alert('新增成功');
      selectLocationID.value = data.LocationID;
      inputText.value = ''; // 新增後清空輸入框
      
      // 更新 locations 資料
      locations.value = await fetchLoactions(); 
      
    } catch (error) {
      console.error('推送變更時出錯:', error);
    }
  }
};


const selectLocations = (location) => {
  inputText.value = location;

  const selectedLocation = locations.value.find(loc => loc.LocationName === location);
  if (selectedLocation) {
    selectLocationID.value = selectedLocation.LocationID;
  } else {
    throw new Error("Location Name is not found.");
  }
};

const startPerformance = () => {

  const validLocation = locations.value.find(loc => loc.LocationName === inputText.value);

  if(selectLocationID.value === null || !validLocation) {
    alert("請新增表演地點或從列表中選擇")
    return;
  }
  
  performanceStartTime.value = new Date();
  isPerformanceStarted.value = true;

  localStorage.setItem("Performance", JSON.stringify({
    LocationID: validLocation.LocationID,
    LocationName: validLocation.LocationName,
    StartTime: performanceStartTime.value.toISOString(),
  }));

  
  startElapsedTimeCounter();
};

const endPerformance = () => {
  isPerformanceStarted.value = false;
  selectLocationID.value = null;
  if(intervalId)
    clearInterval(intervalId); // 停止計時器
  localStorage.removeItem("Performance"); // 清除 localStorage 中的狀態
  alert("表演已結束");
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
                <label class="form-control-label">輸入場地</label>
                <argon-input
                  v-model="inputText"
                  type="text"
                  placeholder="請輸入場地名稱"
                />
                <label class="form-control-label">過往場地</label>
                <typing-hints
                  class="form-control"
                  :hints="filteredLocations"
                  :inputValue="inputText"
                  @selectHint="selectLocations"
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
