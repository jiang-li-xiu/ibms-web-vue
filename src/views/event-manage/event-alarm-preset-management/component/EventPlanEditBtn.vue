<!--
 * @Descripttion: 
 * @Author: ZhouYongqiu
 * @Date: 2022-05-20 09:36:43
 * @LastEditors: PengXuanwei
 * @LastEditTime: 2022-05-24 17:25:17
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      @close="cancel"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="设备类型id" prop="deviceTypeId" hidden>
          <el-select v-model="form.deviceTypeId" placeholder="请选择设备类型id">
            <el-option
              v-for="(item, index) in deviceClassType"
              v-if="item.systemId === form.systemId"
              :key="index"
              :label="item.deviceTypeName"
              :value="item.deviceTypeId"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="子系统" prop="subSystemId">
          <el-select
            v-model="form.systemId"
            placeholder="请选择子系统"
            @change="changeList"
            clearable
          >
            <el-option
              v-for="(item, index) in subSystemList"
              :key="index"
              :label="item.title"
              v-model="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeName">
          <el-select
            v-model="form.deviceTypeName"
            placeholder="请选择设备类型"
            :disabled="!form.systemId"
            clearable
          >
            <el-option
              v-for="(item, index) in deviceClassTypeList"
              :key="index"
              :label="item.deviceTypeName"
              :value="item.deviceTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预案名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入预案名称" />
        </el-form-item>
        <el-form-item label="预案内容" prop="planContent">
          <textarea rows="10" cols="50" v-model="form.planContent" />
        </el-form-item>
        <el-form-item label="启用状态" prop="planStarts">
          <el-select
            v-model="form.planStarts"
            placeholder="请选择处理状态"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in isState"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="删除标识:0-未删除，1-已删除"
          prop="deleted"
          v-show="false"
        >
          <el-input
            v-model="form.deleted"
            placeholder="请输入删除标识:0-未删除，1-已删除"
          />
        </el-form-item>
        <el-form-item label="版本号" prop="version" v-show="false">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlan,
  addPlan,
  updatePlan,
  listSubSystem,
  getDeviceClassTypeList,
} from "@/api/common-config/event-manage/plan";
export default {
  name: "EventPlanEditBtn",
  components: {},
  props: {
    isState: {
      type: Array,
      default() {
        return [];
      },
      require: true,
    },
  },
  data() {
    return {
      // 控制显隐
      open: false,
      // dialog标题
      title: "",
      // 表单参数
      form: {
        id: null,
        deviceTypeId: null,
        deviceTypeName: null,
        planName: null,
        planContent: null,
        planStarts: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleted: null,
        version: null,
        systemId: null,
        systemName: null,
      },
      // 表单校验
      rules: {
        planName: [
          { required: true, message: "预案名称不能为空", trigger: "blur" },
        ],
        planContent: [
          { required: true, message: "预案内容不能为空", trigger: "blur" },
        ],
        planStarts: [
          { required: true, message: "启用状态不能为空", trigger: "change" },
        ],
      },
      //设备类型列表
      deviceClassType: [],
      // 设备类型
      deviceClassTypeList: [],
      // 子系统列表
      subSystemList: [],
    };
  },
  created() {
    this.getDeviceClassTypeListData();
    this.handleSubSystem();
  },
  computed: {},
  watch: {},
  methods: {
    changeList(val) {
      this.form.deviceTypeName = null;
      let newData = [];
      this.deviceClassType.map((item) => {
        if (item.systemId == val) {
          newData.push(item);
        }
        return newData;
      });
      this.deviceClassTypeList = newData;
    },
    add() {
      this.reset();
      this.open = true;
    },
    edit(row) {
      this.reset();
      this.open = true;
      this.getPlanList(row.id);
      this.changeList(row.systemId);
    },
    getPlanList(id) {
      getPlan(id).then((response) => {
        this.form = response.data;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 获取设备类型列表 */
    getDeviceClassTypeListData() {
      getDeviceClassTypeList().then((response) => {
        this.deviceClassType = response.data;
      });
    },
    /** 子系统列表 */
    handleSubSystem() {
      listSubSystem().then((response) => {
        this.subSystemList = response.data;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        deviceTypeId: null,
        deviceTypeName: null,
        planName: null,
        planContent: null,
        planStarts: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deleted: null,
        version: null,
        systemId: null,
        systemName: null,
      };
      this.resetForm("form");
    },
    systemIdCheckForm() {},
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null && this.form.systemId != null) {
            updatePlan(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.$emit("ok");
            });
          } else if (this.form.systemId != null) {
            for (let item in this.deviceClassType) {
              if (
                this.form.systemId === this.deviceClassType[item].systemId &&
                this.form.deviceTypeName ===
                  this.deviceClassType[item].deviceTypeName
              ) {
                this.form.deviceTypeId =
                  this.deviceClassType[item].deviceTypeId;
              }
            }
            addPlan(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.$emit("ok");
            });
          } else {
            this.$message({
              message: "请完善数据",
              type: "warning",
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
