
import { performanceName } from '../utils/utils';

const state = () => ({
  performance: {
    LocationID: null,
    LocationName: null,
    StartTime: null,
    PerformanceID: null,
    PerformanceName: null,
  },
  elapsedTime: null,
  timerID: null,
  statsOrders: {
    totalRevenue: 0,
    totalOrders: 0,
  }
});

const getters = {
  isPerformanceStarted: (state) => !!state.performance.StartTime,
};

const mutations = {
  setPerformance(state, payload) {
    const keys = [
      'LocationID',
      'LocationName',
      'StartTime',
      'PerformanceID',
      'PerformanceName',
    ];

    keys.forEach((key) => {
      state.performance[key] = payload[key];
    });
  },
  setElapsedTime(state, elapsedTime) {
    state.elapsedTime = elapsedTime;
  },
  setElapsedTimeCounterID(state, timerID) {
    state.timerID = timerID;
  },
  clearOrderStats(state) {
    state.statsOrders.totalRevenue = 0;
    state.statsOrders.totalOrders = 0;
  },
  addOrder(state, revenue) {
    state.statsOrders.totalOrders += 1;
    state.statsOrders.totalRevenue += revenue;
  },
};

const actions = {
  loadPerformance({ commit }) {
    const savedData = JSON.parse(localStorage.getItem('Performance'));
    if (savedData) {
      commit('setPerformance', {
        ...savedData,
        StartTime: new Date(savedData.StartTime),
      });
    }
  },
  clearPerformance({ commit }) {
    commit('setPerformance', {
      LocationID: null,
      LocationName: null,
      StartTime: null,
      PerformanceID: null,
      PerformanceName: null,
    });
    localStorage.removeItem('Performance');
  },
  startPerformance({ state, dispatch }, location) {
    state.performance.StartTime = new Date();
    state.performance.LocationID = location.LocationID;
    state.performance.LocationName = location.LocationName;
    dispatch('startElapsedTimeCounter'); 

    const payload = {
      'LocationID': location.LocationID,
      'LocationName': location.LocationName,
      'StartTime': new Date().toISOString(),
      'PerformanceID': null,
      'PerformanceName': null
    }

    fetch("/api/postgres/performance/start", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        LocationID: location.LocationID,
        StartTime: payload.StartTime
      })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json(); // Expected to return PerformanceID
      })
      .then(data => {
        console.log("Performance started!");
        payload.PerformanceID = data.PerformanceID;
        payload.PerformanceName = performanceName(payload.StartTime, location.LocationName);
        localStorage.setItem("Performance", JSON.stringify(payload));
        // todo 增加訂單資訊倒 localStorage

        dispatch('startElapsedTimeCounter');
      })
      .catch(error => {
        console.error('Error sending performance start request:', error);
        alert('操作失敗');
      });
  },
  endPerformance({ state, commit }) {
    localStorage.removeItem('Performance');
    commit('setPerformance', {
      LocationID: null,
      LocationName: null,
      StartTime: null,
      PerformanceID: null,
      PerformanceName: null
    });

    // 擺攤的訂單統計歸零
    commit('clearOrderStats');

    // 清除計時器
    clearInterval(state.timerID);
    commit('setElapsedTime', null);
  },
  startElapsedTimeCounter({ state, commit }) {
    const timerID = setInterval(() => {
      const now = new Date();
      const diff = now - state.performance.StartTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      const elapsedTime = `${hours}小時 ${minutes}分 ${seconds}秒`;
      commit('setElapsedTime', elapsedTime);
    }, 1000);
    commit('setElapsedTimeCounterID', timerID);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
