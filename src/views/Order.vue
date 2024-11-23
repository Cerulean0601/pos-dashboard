<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { format } from 'date-fns';
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonRadio from '../components/ArgonRadio.vue';
import ProductsTable from './components/ProductsTable.vue';
import PerformanceSelector from './components/PerformanceSelector.vue';
import { fetchAndCache, fetchLoactions, fetchProducts, fetchPerformances } from '../utils/fetchData';

const store = useStore(); // 使用 Vuex
const orderTime = ref(new Date());
const timeFormString = (time) => format(time, "yyyy-MM-dd HH:mm");

const notes = ref('');
const locations = ref(null);
const products = ref(null);
const showProductTable = ref(false);
const showPerformanceSelector = ref(false);
const selectedProductIndex = ref(null);
const selectedPaymentMethod = ref('');
const paymentMethods = ref({
  crash: "現金",
  linepay: "LinePay",
  jkopay: "街口支付",
});

// 訂單品項資訊
const orderProducts = ref([
  { ProductName: '', ProductID: null, Quantity: 1, Price: null },
  { ProductName: '', ProductID: null, Quantity: 1, Price: null }
]);

const performance = computed(() => store.state.performance.performance);
const isPerformanceStarted = computed(() => store.getters['performance/isPerformanceStarted']);
const elapsedTime = computed(() => store.state.performance.elapsedTime);

// 計算訂單總價
const totalPrice = computed(() => {
  return orderProducts.value.reduce((total, product) => total + (product.Price || 0), 0);
});

// 新增一個品項
const addOrderProduct = () => {
  orderProducts.value.push({ ProductName: '', ProductID: null, Quantity: 1, Price: null });
};

// 選擇商品並關閉產品選擇表
const selectProduct = (product) => {
  if (selectedProductIndex.value !== null) {
    orderProducts.value[selectedProductIndex.value].ProductName = product.ProductName;
    orderProducts.value[selectedProductIndex.value].ProductID = product.ProductID;
    orderProducts.value[selectedProductIndex.value].Price = product.Price;
    orderProducts.value[selectedProductIndex.value].Quantity = 1;
    selectedProductIndex.value = null;
    showProductTable.value = false;
  }
};

// 初始化訂單
const initOrder = () => {
  orderTime.value = new Date();
  notes.value = '';
  orderProducts.value = [
    { ProductName: '', ProductID: null, Quantity: 1, Price: null },
    { ProductName: '', ProductID: null, Quantity: 1, Price: null }
  ];
};

// 更新品項總價
const updateProductTotalPrice = (index) => {
  const orderProduct = orderProducts.value[index];
  const updateProduct = products.value.find(p => p.ProductID === orderProduct.ProductID);
  if (updateProduct && updateProduct.Price !== null) {
    orderProduct.Price = orderProduct.Quantity * updateProduct.Price;
  }
};

// 提交訂單
const submitOrder = async () => {
  if (notes.value.length > 255) {
    alert("備註不能超過255個字");
    return;
  }

  orderProducts.value = orderProducts.value.filter(
    (product) => product.ProductName.trim() !== ""
  );

  const invalidProducts = orderProducts.value.filter(product => {
    return !products.value.some(p => p.ProductID === product.ProductID);
  });

  if (invalidProducts.length > 0) {
    alert(`以下商品名稱無效：${invalidProducts.map(p => p.ProductName).join(", ")}`);
    return;
  }

  const orderData = {
    OrderTime: orderTime.value,
    Notes: notes.value,
    PaymentMethod: selectedPaymentMethod,
    OrderProducts: orderProducts.value,
    PerformanceID: performance.value.PerformanceID || null,
  };

  try {
    const response = await fetch('/api/postgres/order/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (result.success) {
      console.log('Order submitted successfully', result.orderID);
      if (isPerformanceStarted.value) {
        store.commit('performance/addOrder', totalPrice.value); // 更新訂單統計
      }
      initOrder();
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
    store.dispatch('performance/loadPerformance'); // 從 Vuex 恢復表演狀態
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-8">
        <div v-if="isPerformanceStarted" class="card mb-2">
          <div class="card-header pb-0">
            <b class="mb-0">擺攤資訊</b>
          </div>
          <div class="card-body">
            <div class="align-items-center">
              <div>擺攤持續時間：{{ elapsedTime }}</div>
              <div>總收入：{{ store.state.performance.statsOrders.totalRevenue }} 元</div>
              <div>訂單數：{{ store.state.performance.statsOrders.totalOrders }}</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <b class="mb-0">新增訂單</b>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <label for="order-time" class="form-control-label">訂單時間</label>
                <argon-input type="datetime-local" :modelValue="timeFormString(orderTime)" />
                <!-- 擺攤場次選擇 -->
                <label for="performance" class="form-control-label">擺攤場次</label>
                <argon-input
                  type="text"
                  v-model="performance.PerformanceName"
                  isReadOnly
                  @click="() => {showPerformanceSelector = true}"
                />
              </div>
              <div class="col-md-12">
                <label for="notes" class="form-control-label">備註</label>
                <argon-input type="text" v-model="notes" />
              </div>
            </div>

            <!-- 訂單品項資訊 -->
            <p class="text-uppercase text-sm">訂單品項</p>
            <div v-for="(orderProduct, index) in orderProducts" :key="index" class="row mb-2">
              <div class="d-flex justify-content-between">
                <div>
                  <label :for="'product-name-' + index" class="form-control-label">商品名稱</label>
                  <argon-input
                    type="text"
                    v-model="orderProduct.ProductName"
                    @focus="() => { selectedProductIndex = index; showProductTable = true; }"
                  />
                </div>
                <div>
                  <label :for="'quantity-' + index" class="form-control-label">數量</label>
                  <argon-input
                    type="number" 
                    v-model="orderProduct.Quantity" 
                    @input="() => updateProductTotalPrice(index)"
                  />
                </div>
                <div>
                  <label :for="'price-' + index" class="form-control-label">總價</label>
                  <argon-input 
                    type="number" 
                    v-model="orderProduct.Price"
                    @input="orderProduct.Price = $event.target.value === '' ? null : Number($event.target.value)"
                  />
                </div>
              </div>
            </div>
            <!-- 支付方式 -->
            <hr class="horizontal dark" />
            <div class="row mb-3">
              <div class="col">
                <label for="totalPrice" class="form-control-label">訂單總價</label>
                <argon-input type="number" v-model="totalPrice" />
              </div>
              <div class="col-md-6">
                <label for="paymentMethod" class="form-control-label">支付方式</label>
                <div v-for="(method, key) in paymentMethods" :key=key role="group" aria-label="Payment method">
                  <argon-radio 
                  :id=key name="paymentMethod" 
                  :value="key" 
                  :checked="key === 'crash'"
                  v-model="selectedPaymentMethod">
                    {{ method }}
                  </argon-radio>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <argon-button color="primary" size="sm" @click="addOrderProduct">新增品項</argon-button>
                <argon-button color="success" size="sm" class="ms-auto" @click="submitOrder">提交訂單</argon-button>
              </div>
            </div>

            <!-- Product selection table -->
            <products-table v-if="showProductTable" @selectProduct="selectProduct" />
            
          </div>
        </div>
      </div>
    </div>
    <!-- 擺攤場次選擇彈窗 -->
    <performance-selector
      :fetchFunction="fetchPerformances"
      :dataSize="numPerformance"
      :show="showPerformanceSelector"
      @update:show="showPerformanceSelector = $event"
      @select="($event) => {performance = $event;}"
    />
  </div>
</template>
