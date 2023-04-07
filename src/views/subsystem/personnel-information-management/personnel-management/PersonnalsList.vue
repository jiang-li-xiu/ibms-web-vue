<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-22 10:17:05
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-24 09:41:43
-->

<template>
  <el-card class="min-height-124">
    <!-- 标题 -->
    <div class="table-title">{{ tableTitle }}</div>

    <el-form
      :inline="true"
      ref="queryForm"
      :model="queryParams"
      class="demo-form-inline"
    >
      <el-form-item label="姓名" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入姓名"
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="queryParams.gender"
          placeholder="请选择性别"
          clearable
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="item in genderTypeList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="证件号码" prop="certificateNo">
        <el-input
          v-model="queryParams.certificateNo"
          placeholder="请输入证件号码"
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>

      <el-form-item label="">
        <el-button icon="el-icon-search" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            v-if="treeNode.id !== 0"
          >
            新增
          </el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete">
            批量删除
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableList"
        @selection-change="handleSelectionChange"
        border
        :row-key="rowKey"
      >
        <el-table-column type="selection" header-align="center" align="center">
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="personName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="性别"
          prop="gender"
          header-align="center"
          align="center"
          :formatter="genderTypeFormat"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="联系电话"
          prop="phoneNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="工号"
          prop="jobNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="证件类型"
          prop="certificateType"
          header-align="center"
          align="center"
          :formatter="certificateTypeFormat"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="证件号码"
          prop="certificateNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- <el-table-column
          label="人员图片"
          prop="picUri"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.personPhoto.picUri"
              alt="picUri"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column> -->

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="600"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除
            </el-button>
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
              >详情
            </el-button>
            <el-button
              type="primary"
              plain
              @click="handleFaceManagement(scope.row)"
              v-if="scope.row.personPhoto.length === 0"
              >管理人脸
            </el-button>
            <el-button
              type="danger"
              plain
              @click="handleDeleteFace(scope.row)"
              v-if="scope.row.personPhoto.length !== 0"
              >删除人脸
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNo"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-form>

    <!-- 新增编辑弹窗 -->
    <add-and-edit-diloag
      ref="modelForm"
      @refresh="getList"
      :orgIndexCode="orgIndexCode"
    ></add-and-edit-diloag>

    <!-- 管理人脸 -->
    <face-management ref="face" @refresh="getList"></face-management>
  </el-card>
</template>

<script>
// API
import {
  getPersonnlList,
  deletePersonnlInfo,
} from "@/api/subsystem/personnel-information-management/personnelManagement.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
// 组件
import AddAndEditDiloag from "./AddAndEditDiloag.vue";
import FaceManagement from "./FaceManagement.vue";
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDiloag, FaceManagement },
  props: {
    treeNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 唯一标识
      rowKey: "personId",
      // 表单数据
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        gender: "", //性别
        personId: "", //人员id
        personName: "", //姓名
        phoneNo: "", //联系电话
        jobNo: "", //工号
        certificateType: null, //证件类型
        certificateNo: "", //证件号码
        createTime: null, //创建时间
        updateTime: null, //更新时间
        // personPhoto: {
        //   picUri: "", //图片地址
        // }, //人员图片信息
      },
      //标题
      tableTitle: "全部",

      // tableList: [
      //   {
      //     id: "1",
      //     personName: "假",
      //     certificateType: "111",
      //     personPhoto: {
      //       picUri:
      //         "https://img0.baidu.com/it/u=530426417,2082848644&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500",
      //     },
      //   },
      // ],

      dialogDetailVisible: false,
      // 性别列表
      genderTypeList: [],
      // 证件类型
      certificateTypeList: [],
      // 详情
      details: [],
      interface: {
        // 获取人员信息列表
        getTableList: getPersonnlList,
      },
      // 保存id
      orgIndexCode: "",
    };
  },
  created() {
    // 获取性别列表字典
    this.getDicts("sys_user_sex").then((res) => {
      this.genderTypeList = res.data;
    });
    // 获取证件类型列表字典
    this.getDicts("document_type").then((res) => {
      this.certificateTypeList = res.data;
    });
  },
  methods: {
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      const ids = row.personId || this.selectedRowKeys;
      console.log(ids);
      let that = this;
      that
        .$confirm("是否确认删除此数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return deletePersonnlInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 检索搜索 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    /** 详情 */
    handleDetail(record) {
      this.$refs.modelForm.detail(record);
      this.$refs.modelForm.title = "详情";
      this.$refs.modelForm.disableSubmit = true;
    },

    // 翻译性别字典
    genderTypeFormat(row, column) {
      return this.selectDictLabel(this.genderTypeList, row.gender);
    },
    // 翻译证件类型字典
    certificateTypeFormat(row, column) {
      return this.selectDictLabel(
        this.certificateTypeList,
        row.certificateType
      );
    },

    // 管理人脸
    handleFaceManagement(record) {
      this.$refs.face.add(record);
    },

    // 删除人脸
    handleDeleteFace(record) {
      this.$refs.face.delete(record);
    },
  },

  watch: {
    treeNode: {
      handler(newVal) {
        console.log(newVal);
        // 保存id
        this.orgIndexCode = newVal.id;
        this.queryParams.orgIndexCode = newVal.id;
        this.tableTitle = newVal.label;
        this.getList();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 84px);
  background-color: #eee;
  padding: 1em;

  .container-record {
    min-height: calc(100vh - 124px);
    background-color: #fff;
    padding: 0.7em;
    border-radius: 0.2em;
  }
}
</style>
