<!--
 * @Descripttion: 电子地图
 * @version:
 * @Author: luojiaju
 * @LastEditors: luojiaju
 * @Date: 2021-09-15 09:49:34
 * @LastEditTime: 2021-09-18 14:11:21
-->
<template>
  <div class="app-container">
    <div class="container_details_box">


    <h1>楼号</h1>
    <el-tabs v-model="indexTab">

      <el-tab-pane label="地图" name="1">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
        <el-image v-for="url in urls" :key="url" :src="url" lazy :preview-src-list="urls"></el-image>
      </el-tab-pane>

    </el-tabs>
    </div>
  </div>
</template>

<script>
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  components: {  },

  data() {
    return {
      indexTab: '1',
      checkList: ['选中且禁用','复选框 A'],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      // 查询区域的高度
      queryElHeight: 52,
      query: {
        name: '',
      },
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setQueryElHeight()
    })
    // 监听查询区域的高度
    window.addEventListener('resize', this.setQueryElHeight)
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener('resize', this.setQueryElHeight)
  },
  methods: {
    setQueryElHeight() {
      this.queryElHeight = this.$refs.queryRef.offsetHeight
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    }
  },
}
</script>

<style lang="scss" scoped>
.assembly-container {
  height: calc(100vh - 84px);
  background-color: #eee;
}

.container_details_box {
  width: 99%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
}
</style>
