<script setup>
import ArgonInput from '../../components/ArgonInput.vue';
import ArgonButton from '../../components/ArgonButton.vue';
import SelfSelect from '../../components/SelfSelect.vue';
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>商品管理</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">商品名稱</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">類別</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">價格</th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.ProductID">
              <td>
                <argon-input v-model="item.ProductName" placeholder="商品名稱"/>
              </td>
              <td>
                <self-select v-model="item.CategoryName" :options="categories"/>
              </td>
              <td class="align-middle text-center">
                <argon-input v-model.number="item.Price" placeholder="價格" type="number"/>
              </td>
              <td class="align-middle">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" @click="removeItem(item)">刪除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-header pb-0">
        <h6>新增商品</h6>
      </div>
      <div class="card-body">
        <form role="form" @submit.prevent="addItem">
          <argon-input v-model="newItem.ProductName" placeholder="商品名稱" isRequired/>
          <self-select v-model="newItem.CategoryName" :options="categories"/>
          <argon-input v-model.number="newItem.Price" type="number" placeholder="價格"/>
          <argon-button type="submit" color="primary">新增商品</argon-button>
          <!-- <button type="submit" class="btn btn-primary mt-2">新增商品</button> -->
        </form>
        <button @click="confirmChanges" class="btn btn-success mt-2">確認變更</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      origin_data: [], // 從資料庫獲取的原始資料
      items: [], // 用於展示的資料，包括新增的資料
      categories: [],
      newItem: {
        ProductName: '',
        CategoryName: '',
        Price: null,
      },
      pendingChanges: {
        update: [],
        remove: [],
        add: [],
      },
    };
  },
  methods: {
    async fetchItems() {
      try {
        const response = await fetch('/api/postgres/product/products');
        const data = await response.json();
        // const data = [
        //   {
        //     ProductID: 1,
        //     ProductName: 'test',
        //     CategoryName: 'test',
        //     Price: 22,
        //   }
        // ]
        this.origin_data = data; // 將資料儲存到 origin_data
        this.items = JSON.parse(JSON.stringify(data)); // 複製一份資料以便於修改
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch('/api/postgres/category/categories');
        const data = await response.json();
        this.categories = data.map(category => {return category.CategoryName}); // 將類別數據保存到 categories 中
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    addItem() {
      const newId = this.items.length ? this.items[this.items.length - 1].ProductID + 1 : 1;
      const newItem = { ProductID: newId, ...this.newItem};
      this.items.push(newItem); // 僅在組件中添加，不推送到資料庫
      this.pendingChanges.add.push(newItem); // 將新增的資料標記為待新增
      this.newItem = { ProductName: '', CategoryName: '', Price: null }; // 重置新增商品表單
    },
    removeItem(item) {
      const confirmed = confirm('是否確定刪除？');
      if (!confirmed) return;

      // 檢查 item 是否在 origin_data 中，若存在則標記為刪除
      const index = this.origin_data.findIndex(i => i.ProductID === item.ProductID);
      if (index > -1) {
        this.pendingChanges.remove.push(item); // 若為原始資料，則推入待刪除陣列
      }
      // 從 items 中刪除，若是新增商品則從pedningChanges.add中刪除
      this.items = this.items.filter(i => i.ProductID !== item.ProductID);
      this.pendingChanges.add = this.pendingChanges.add.filter(i => i.ProductID !== item.ProductID);
    },
    confirmChanges() {
      // 收集所有的更新資料
      this.items.forEach(item => {
        const originalItem = this.origin_data.find(i => i.ProductID === item.ProductID);
        if (originalItem) {
          // 如果原始項目存在於 origin_data，則表示它被修改
          if (
            originalItem.ProductName !== item.ProductName ||
            originalItem.CategoryName !== item.CategoryName ||
            originalItem.Price !== item.Price
          ) {
            this.pendingChanges.update.push(item); // 若有變更，則推入待更新陣列
          }
        }
      });
      // 現在進行批次更新
      const batchChanges = {
        add: this.pendingChanges.add, // 將新增的資料推入
        update: this.pendingChanges.update,
        remove: this.pendingChanges.remove.map(item => item.ProductID),
      };

      fetch('/api/postgres/product/batchChange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchChanges),
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          alert('變更成功');
          // 清空待提交的變更
          this.pendingChanges = { update: [], remove: [], add: [] }; 
          this.fetchItems(); // 重新獲取資料以更新顯示
        })
        .catch(error => {
          console.error('推送變更時出錯:', error);
        });
    },
  },
  mounted() {
    this.fetchItems(); // 頁面加載時獲取資料
    this.fetchCategories();
  },
};
</script>

<style scoped>
.form-control {
  margin-bottom: 10px;
}
</style>
