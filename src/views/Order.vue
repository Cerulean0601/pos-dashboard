<script setup>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ProductsTable from './components/ProductsTable.vue';
import { fetchAndCache, fetchLoactions, fetchProducts } from '../utils/fetchData';
import LocationInput from "@/components/LocationInput.vue"

const orderTime = ref(new Date());
const timeFormString = format(orderTime.value, "yyyy-MM-dd HH:mm");
const performance = ref(null);
const notes = ref('');
const locations = ref(null);
const selectLocationID = ref();
const products = ref(null);
const showProductTable = ref(false);
const selectedProductIndex = ref(null);

// 訂單品項資訊
const orderProducts = ref([
  { ProductName: '', ProductID: null, Quantity: 1 },
  { ProductName: '', ProductID: null, Quantity: 1 }
]);

// 新增一個品項
const addOrderProduct = () => {
  orderProducts.value.push({ ProductName: '', ProductID: null, Quantity: 1 });
};

// 選擇商品並關閉產品選擇表
const selectProduct = (product) => {
  if (selectedProductIndex.value !== null) {
    orderProducts.value[selectedProductIndex.value].ProductName = product.ProductName;
    orderProducts.value[selectedProductIndex.value].ProductID = product.ProductID;
    selectedProductIndex.value = null;
    showProductTable.value = false;
  }
};

// 提交訂單
const submitOrder = async () => {
  if(notes.value.length > 255)
    alert("備註不能超過255個字");

  orderProducts.value = orderProducts.value.filter(
    (product) => product.ProductName.trim() !== ""
  );

  const invalidProducts = [];
  orderProducts.value.forEach((product) => {
    const isValid = products.value.some(
      (p) => p.ProductName === product.ProductName
    );

    if (!isValid) {
      invalidProducts.push(product.ProductName);
    }
  });

  if (invalidProducts.length > 0) {
    alert(`以下商品名稱無效：${invalidProducts.join(", ")}`);
    return;
  }

  const orderData = {
    OrderTime: orderTime.value,
    Notes: notes.value,
    OrderProducts: orderProducts.value,
  };
  
  if(performance.value){
    if(performance.value.PerformanceID)
      orderData.PerformanceID = performance.value.PerformanceID;
    else
      console.error("Failed to read PerformanceID...");
  }

  try {
    const response = await fetch('/api/postgres/order/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (result.success) {
      console.log('Order submitted successfully', result.orderID);
      alert("新增訂單成功");
    } else {
      console.error('Failed to submit order:', result.message);
      alert("訂單新增失敗");
    }
  } catch (error) {
    console.error('Error submitting order:', error);
    alert("訂單新增失敗");
  }
};

onMounted(async () => {
  try {
    locations.value = await fetchAndCache(fetchLoactions, "Locations");
    products.value = await fetchAndCache(fetchProducts, "Products");
    const performanceData = localStorage.getItem("Performance");
    if (performanceData) {
      performance.value = JSON.parse(performanceData);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

const selectLocations = (loc) => {
  const selectedLocation = locations.value.find(l => l.LocationName === loc);
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
            <div class="d-flex align-items-center">
              <p class="mb-0">新增訂單</p>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <label for="order-time" class="form-control-label">訂單時間</label>
                <argon-input type="datetime-local" :modelValue="timeFormString" />
              </div>
              <div class="col-md-6">
                <location-input
                  :locations="locations"
                  @locationSelected="selectLocations"
                  @typingLocation="(loc) => {inputText = loc}"
                />
              </div>
              <div class="col-md-12">
                <label for="notes" class="form-control-label">備註</label>
                <argon-input type="text" v-model="notes" />
              </div>
            </div>

            <!-- 訂單品項資訊 -->
            <hr class="horizontal dark" />
            <p class="text-uppercase text-sm">訂單品項</p>
            <div v-for="(orderProduct, index) in orderProducts" :key="index" class="row mb-2">
              <div class="col-md-6">
                <label :for="'product-name-' + index" class="form-control-label">商品名稱</label>
                <argon-input
                  type="text"
                  v-model="orderProduct.ProductName"
                  @focus="() => { selectedProductIndex = index; showProductTable = true; }"
                />
              </div>
              <div class="col-md-6">
                <label :for="'quantity-' + index" class="form-control-label">數量</label>
                <argon-input type="number" v-model="orderProduct.Quantity" />
              </div>
            </div>

            <argon-button color="primary" size="sm" @click="addOrderProduct">新增品項</argon-button>

            <!-- Product selection table -->
            <products-table v-if="showProductTable" @selectProduct="selectProduct" />

            <!-- 提交按鈕 -->
            <argon-button color="success" size="sm" class="ms-auto" @click="submitOrder">提交訂單</argon-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
