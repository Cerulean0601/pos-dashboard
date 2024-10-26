<script setup>
import { ref } from 'vue';
import ProdcutManager from "./components/ProductManager.vue";
import CategoryManager from "./components/CategoryManager.vue";

// 設置一個反應式變量來追蹤當前顯示的組件
const activeTab = ref('categoryManager'); // 預設顯示 ProductManager
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="nav-wrapper">
        <ul class="nav nav-pills" role="tablist">
          <li class="nav-item">
            <a 
              class="nav-link mb-sm-3 mb-md-0" 
              :class="{ active: activeTab === 'productManager' }" 
              @click="activeTab = 'productManager'"
              role="tab"
            >
              商品管理
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link mb-sm-3 mb-md-0" 
              :class="{ active: activeTab === 'projectsTable' }" 
              @click="activeTab = 'projectsTable'"
              role="tab"
            >
              類別管理
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="row">
      <div class="mt-4">
        <component :is="activeTab === 'productManager' ? ProdcutManager : CategoryManager" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-pills {
  flex-direction: row; /* 水平排列 */
  justify-content: flex-start; /* 從最左邊開始排列 */
}

.nav-pills .nav-item {
  flex: 0 0 150px; /* 固定每個tab的寬度，可以根據需求調整 */
}

.nav-pills .nav-link.active {
  background-color: #007bff; /* 主題顏色 */
  color: white;
}

.nav-pills .nav-link {
  cursor: pointer;
  text-align: center; /* 讓tab文字置中 */
  padding: 10px 15px; /* 控制內間距 */
  margin-right: 10px; /* 每個tab之間的空間 */
}
</style>
