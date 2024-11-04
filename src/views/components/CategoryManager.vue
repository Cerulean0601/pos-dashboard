<script setup>
import ArgonInput from '../../components/ArgonInput.vue';
import ArgonButton from '../../components/ArgonButton.vue';
import { fetchCategories, fetchAndCache } from '../../utils/fetchData';
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>類別管理</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">類別名稱</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.CategoryID">
              <td>
                <argon-input v-model="item.CategoryName" placeholder="類別名稱"/>
              </td>
              <td class="align-middle">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" @click="removeItem(item)">刪除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-header pb-0">
        <h6>新增類別</h6>
      </div>
      <div class="card-body">
        <form role="form" @submit.prevent="addItem">
          <argon-input v-model="newItem.CategoryName" placeholder="類別名稱" isRequired/>
          <argon-button type="submit" color="primary">新增類別</argon-button>
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
      newItem: {
        CategoryName: '',
      },
      pendingChanges: {
        update: [],
        remove: [],
        add: [],
      },
    };
  },
  methods: {
    fetchAndCacheCategories() {
      (async () => {
        this.origin_data = await fetchAndCache(fetchCategories, "Categories");
        this.items = JSON.parse(JSON.stringify(this.origin_data));
      })();
    },
    addItem() {
      const newId = this.items.length ? this.items[this.items.length - 1].CategoryID + 1 : 1;
      const newItem = { CategoryID: newId, ...this.newItem};
      this.items.push(newItem); // 僅在組件中添加，不推送到資料庫
      this.pendingChanges.add.push(newItem); // 將新增的資料標記為待新增
      this.newItem = { CategoryName: "" };
    },
    removeItem(item) {
      const confirmed = confirm('是否確定刪除？');
      if (!confirmed) return;
      const index = this.origin_data.findIndex(i => i.CategoryID === item.CategoryID);
      if (index > -1) {
        this.pendingChanges.remove.push(item);
      }
      this.items = this.items.filter(i => i.CategoryID !== item.CategoryID);
      this.pendingChanges.add = this.pendingChanges.add.filter(i => i.CategoryID !== item.CategoryID);
      console.log("從列表刪除: ", item.CategoryName);
    },
    confirmChanges() {
      // 收集所有的更新資料
      this.items.forEach(item => {
        const originalItem = this.origin_data.find(i => i.CategoryID === item.CategoryID);
        if (originalItem) {
          // 如果原始項目存在於 origin_data，則表示它被修改
          if (
            originalItem.CategoryName !== item.CategoryName
          ) {
            this.pendingChanges.update.push(item); // 若有變更，則推入待更新陣列
          }
        }
      });
      // 現在進行批次更新
      const batchChanges = {
        add: this.pendingChanges.add, // 將新增的資料推入
        update: this.pendingChanges.update,
        remove: this.pendingChanges.remove.map(item => item.CategoryID),
      };

      fetch('/api/postgres/category/batchChange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchChanges),
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          alert('變更成功');
          // 清空待提交的變更
          this.pendingChanges = { update: [], remove: [], add: [] }; 
          localStorage.removeItem("Categories");
          this.fetchAndCacheCategories();
        })
        .catch(error => {
          console.error('推送變更時出錯:', error);
        });
    },
  },
  mounted() {
    this.fetchAndCacheCategories();
  },
};
</script>

<style scoped>
.form-control {
  margin-bottom: 10px;
}
</style>
