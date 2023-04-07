<!--
 * @Descripttion: 
 * @Author: PengXuanwei
 * @Date: 2022-03-28 17:20:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-30 16:03:23
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :loading="spinning"
    append-to-body
  >
    <el-form
      ref="modelForm"
      :model="modelForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="modelForm.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="modelForm.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input-number
          v-model="modelForm.postSort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-radio-group v-model="modelForm.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="modelForm.remark"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addList, editList, getListDetail } from "@/api/system/post";
export default {
  name: "PostModelForm",
  props: {
    statusOptions: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      // 弹窗标题
      title: "",
      // 控制弹窗显隐
      visible: false,
      // 表单参数
      modelForm: {},
      // 表单校验
      rules: {
        postName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" },
        ],
        postCode: [
          { required: true, message: "岗位编码不能为空", trigger: "blur" },
        ],
        postSort: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" },
        ],
      },
      //   弹窗数据加载动画
      spinning: false,
      //   控制是否可编辑
      disableSubmit: false,
    };
  },
  methods: {
    /** 点击新增触发 */
    add() {
      this.refresh();
      this.visible = true;
    },
    /** 触发编辑功能 */
    edit(record) {
      this.spinning = true;
      getListDetail(record.postId).then((response) => {
        this.modelForm = { ...response.data };
        this.spinning = false;
      });
      this.visible = true;
    },
    /** 重置表单 */
    refresh() {
      this.modelForm = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined,
      };
    },
    /** 弹窗提交 */
    handleSubmit() {
      let that = this;
      that.$refs["modelForm"].validate((valid) => {
        if (valid) {
          let func,msg;
          if (that.modelForm.postId) {
            func = editList(that.modelForm);
            msg = "编辑成功"
          } else {
            func = addList(that.modelForm);
            msg = "新增成功"
          }
          func.then((response) => {
            console.log(response);
            that.msgSuccess(msg);
            that.visible = false;
            that.$emit("ok");
          });
        }
      });
    },
  },
};
</script>
<style scoped lang='scss' >
</style>