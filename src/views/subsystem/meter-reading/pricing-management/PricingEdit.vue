<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-04-26 17:18:23
 * @LastEditors: ZhouYongqiu
 * @LastEditTime: 2022-04-26 17:41:33
-->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="500px"
    append-to-body
  >
    <el-form
      class="demo-ruleForm"
      ref="dialogData"
      :model="dialogData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="方案名称：" prop="schemeName">
        <el-input
          v-model="dialogData.schemeName"
          placeholder="请输入方案名称"
        />
      </el-form-item>
      <el-form-item label="类型：">
        <el-select
          v-model="dialogData.type"
          @change="dialogDataChange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in pricingOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位：">
        <el-input v-model="dialogData.unit" :disabled="true" />
      </el-form-item>
      <el-form-item label="单价：" prop="price">
        <el-input
          v-model="dialogData.price"
          type="number"
          placeholder="请输入单价"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">提 交</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getMeterReadingAdd,
  getMeterReadingEdit,
} from "@/api/subsystem/meter-reading/pricing-management.js";
export default {
  name: "PricingEdit",
  components: {},
  props: {
    pricingOptions: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      dialogVisible: false, //弹框显示
      dialogData: {
        id: "",
        schemeName: "", //方案名称
        type: "1", //类型
        unit: "立方米", //单位
        price: "", //单价
      }, //弹出框数据
      dialogTitle: "新增计价方案", //弹框显示
      rules: {
        schemeName: [
          { required: true, message: "请输入方案名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    //点击新增||修改
    edit(row) {
      this.resetForm("dialogData");
      this.dialogVisible = true;
      if (row == 0) {
        this.dialogData = {
          id: "",
          schemeName: "", //方案名称
          type: "1", //类型
          unit: "立方米", //单位
          price: "", //单价
        }; //弹出框数据
        return;
      } else {
        this.dialogData = {
          id: row.id,
          schemeName: row.schemeName, //方案名称
          type: row.type, //类型
          unit: row.unit, //单位
          price: row.price, //单价
        }; //弹出框数据
      }
    },
    //监听下拉框
    dialogDataChange(e) {
      switch (e) {
        case "2":
          this.dialogData.unit = "度（KWh）";
          break;
        case "1":
        case "3":
          this.dialogData.unit = "立方米（m³）";
          break;
        case "4":
          this.dialogData.unit = "焦耳（J）";
          break;
        case "5":
          this.dialogData.unit = "流量（m³/h）";
          break;
      }
    },
    //提交表单
    submitForm() {
      this.$refs["dialogData"].validate((valid) => {
        let functionsData;
        if (valid) {
          if (this.dialogData.id === "") {
            //新增
            functionsData = getMeterReadingAdd(this.dialogData);
          } else {
            //修改
            functionsData = getMeterReadingEdit(this.dialogData);
          }
          functionsData.then((res) => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.$emit("ok")
              this.dialogVisible = false;
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
              return;
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
