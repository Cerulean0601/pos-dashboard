<script setup>
import ArgonAlert from '../../components/ArgonAlert.vue';
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <button @click="fetchData">Fetch Data</button>
        <div v-if="data">
          <argon-alert color="success" dismissible>
            {{ data }}
          </argon-alert>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                data: null
            }
        },
        methods: {
            async fetchData() {
                try{
                  // 從 localStorage 中取得 token
                  const token = localStorage.getItem('dropbox_access_token');
                  
                  // 設置請求的 headers
                  const headers = {
                    'Authorization': `Bearer ${token}`, // 根據 token 格式調整
                    'Content-Type': 'application/json'
                  };
                  const reponse = await fetch("/api/dropbox/categories", {
                    headers: headers,
                  });
                  
                  const result = await reponse.json();
                  this.data = result;

                } catch (error) {
                    console.error(error.message);
                }
            }
        }
    }
</script>