<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-26 09:58:54
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-05-06 10:30:02
-->
<template>
  <el-dialog title="图片" :visible.sync="dialogImg" width="550px">
    <div class="release-dialog-imgages">
      <el-image
        v-for="(ele, index) in detailsData"
        :key="index"
        style="width: 150px; height: 150px"
        :src="ele"
        :preview-src-list="getPreviewImgList(index)"
      >
      </el-image>
    </div>
    <div slot="footer">
      <el-button @click="dialogImg = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "CheckImg",
  components: {},
  props: {},
  data() {
    return {
      dialogImg: false, // 图片查看弹框
      detailsData: [], // 图片弹框临时数组
    };
  },
  created() {},
  methods: {
    //查看图片-弹窗
    viewCheckclick(imgUrls) {
      if (imgUrls.length > 2) {
        this.detailsData = JSON.parse(imgUrls);
        this.dialogImg = true;
      } else {
        this.$message("该条消息无图片展示");
      }
    },
    //查看图片
    getPreviewImgList: function (index) {
      let arr = [];
      for (let i = 0; i < this.detailsData.length; i++) {
        arr.push(this.detailsData[i + index]);
        if (i + index >= this.detailsData.length - 1) {
          // 为了取后边小值（采用绝对值）
          index = 0 - (i + 1);
        }
      }
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
.release-dialog-imgages {
  display: flex;
  justify-content: space-around;
}

</style>
