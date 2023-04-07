<template>
  <div class="title">
    <div class="common_title">
      <span
        >{{ titleCN }}
        <div class="title_box"></div
      ></span>
    </div>
    <div class="common_title_bot" :style="{ width: botwidth }">
      <span>{{ titleEN }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "beitou_title",
  props: {
    titleCN: {
      type: String,
      default: () => {
        return "智能大厦";
      },
    },
    titleEN: {
      type: String,
      default: () => {
        return "Intelligent Building";
      },
    },
    botwidth: {
      type: String,
      default: () => {
        return "100%";
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
}
.common_title {
  width: 100%;
  font-size: 2vh;
}

.common_title span {
  font-size: 2vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px 0;
  color: #ffffff;
}

.common_title span:before {
  content: "";
  width: 0;
  height: 0;
  border-top: 0.4vw solid transparent;
  border-left: 1.6vh solid #00dcffff;
  border-bottom: 0.4vw solid transparent;
  margin-right: 6px;
}

.common_title span:after {
  content: "";
  margin-left: 2px;
  /* width: 7.2vw; */
  flex: 1;
  height: 1.1vh;
  background: linear-gradient(
    270deg,
    rgba(0, 220, 255, 0) 0%,
    rgba(0, 220, 255, 0.68) 98%,
    rgba(0, 220, 255, 1) 100%
  );
  box-shadow: 0px 0px 1px rgba(0, 220, 255, 0.8);
  opacity: 0.8;
}

.common_title .title_box {
  width: 0.1vw;
  height: 1.6vh;
  background: #00dcffff;
  margin-left: 6px;
}

.common_title_bot {
  display: flex;
  font-size: 0.9vh;
  color: #d4e6e9ff;
  background: rgba(0, 29, 42, 0.1);
  border: 1px solid rgba(0, 220, 255, 1);
  box-shadow: 0px 0px 3px rgba(0, 220, 255, 1);
  border-radius: 3px;
  margin-bottom: 1.6vh;
  box-sizing: border-box;
}

.common_title_bot span {
  font-size: 0.9vh;
  padding-left: 0.5vw;
}
</style>