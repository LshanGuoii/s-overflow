<template>
  <div id="app">
    <el-input-number v-model="num" :min="1"></el-input-number>
    <label>最小显示数量:</label>
    <el-input-number v-model="minCount" :min="0"></el-input-number>
    <s-overflow
      auto-expand
      auto-resize
      :min-count="minCount"
      style="max-width: 300px"
    >
      <div
        v-for="(item, index) of list"
        :key="index"
        style="display: inline-block; border: 1px solid blue"
      >
        {{ item }}
      </div>
    </s-overflow>
    <div>
      <label>占位宽度:</label>
      <el-input-number
        v-model="width"
        :step="50"
        :max="2500"
        :min="100"
      ></el-input-number>
    </div>
    <el-row type="flex">
      <div :style="{ width: `${width}px`, background: 'aliceblue' }">占位</div>
      <s-overflow auto-resize auto-width :min-count="minCount">
        <div
          v-for="(item, index) of list"
          :key="index"
          style="display: inline-block; border: 1px solid blue"
        >
          {{ item }}
        </div>
      </s-overflow>
      <div :style="{ width: `${width}px`, background: 'aliceblue' }">占位</div>
    </el-row>

    <s-overflow
      ref="overflow"
      auto-expand
      auto-resize
      style="max-width: 300px"
      :get-counter="getCounter"
      :resizeDelay="500"
      :min-count="2"
      @counter="counterChange"
    >
      <el-tag
        v-for="(item, index) of list"
        :key="index"
        style="
          margin: 2px 8px 2px 0;
          max-width: calc(100% - 8px);
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          font-size: 16px;
          color: #1f2134;
          background-color: #eee;
          border-radius: 16px;
          border: 0;
          padding: 0 12px 0 8px;
          line-height: 1;
        "
        size="small"
        disable-transitions
      >
        <span class="el-select__tags-text">
          {{ item }}
        </span>
      </el-tag>
      <el-tag
        ref="counter"
        slot="counter"
        slot-scope="counter"
        style="
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          color: #1f2134;
          background-color: #eee;
          border-radius: 16px;
          border: 0;
          padding: 0 12px 0 8px;
          line-height: 1;
        "
        size="small"
        disable-transitions
        @click="expand"
      >
        <span class="el-select__tags-text"> +{{ counter }} </span>
      </el-tag>
    </s-overflow>
  </div>
</template>

<script>
import SOverflow from "./components/main.vue";

export default {
  name: "App",
  components: {
    SOverflow,
  },
  data() {
    return {
      width: 2500,
      num: 4,
      minCount: 0,
    };
  },
  computed: {
    list() {
      return Array.from({ length: this.num }).map(
        () => `${Math.floor(Math.random() * 9999999 + 1)}`
      );
    },
  },
  methods: {
    getCounter() {
      return this.$refs.counter && this.$refs.counter.$el;
    },
    counterChange(counter, counterWidth) {
      console.log("--counterChange---", counter, counterWidth);
    },
    expand() {
      console.log("[ list ]-92", this.list);
      this.$refs.overflow.expand();
    },
  },
};
</script>

<style>
@import "./components/style.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: aliceblue;
  margin-top: 60px;
  width: 800px;
  height: 700px;
  margin: 0 auto;
}
</style>
