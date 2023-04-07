<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-03-31 15:01:12
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-06 18:01:40
-->
<template>
    <el-dialog
      :title="title"
      :visible.sync="isStarted"
      width="500px"
      append-to-body
    >
      <el-form
        ref="processingRecord"
        :model="processingRecord"
        :rules="rules"
        label-width="80px"
        v-loading="optionLoading"
      >
        <el-form-item label="处理人" prop="processingRen">
          <el-input
            v-model="processingRecord.processingRen"
            placeholder="请输入处理人"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="processingMethod" required>
          <el-select
            v-model="processingRecord.processingMethod"
            placeholder="请输入处理方式"
          >
            <el-option
              v-for="(item, index) in planList"
              :key="index"
              :label="item.planName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="processingRecord.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecord">保存</el-button>
        <el-button @click="cancelRecord">取 消</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  name: "PopupDispose",
  components: {},
  props: {
    planList: {
      type: Array,
      require: true,
    },
    optionLoading: {
      type: Boolean,
      require: true,
    }
  },
  data() {
    return {
      // 表单参数
      processingRecord: {
        processingType: null,
        processingRen: null,
        processingMethod: null,
        alarmHistoryId: null,
        remark: null,
      },
      // 表单校验
      rules: {
        processingMethod: [
          { required: true, message: "处理方式不能为空", trigger: "blur" },
        ],
      },
      // 弹出层标题
      title: "",
      // 控制弹出层
      isStarted: false,
      // 接口参数
      port: null,
      // id
      id: "",
    };
  },
  created() {},
  methods: {
    // 弹出框
    dispose(id, port) {
      this.port = port;
      this.id = id;
      this.isStarted = !this.isStarted;
    },
    // 取消弹出框
    cancelRecord() {
      this.isStarted = !this.isStarted;
    },
    // 处理告警记录
    submitRecord() {
      this.port(this.processingRecord, this.id).then((response) => {
      });
      this.isStarted = !this.isStarted;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
