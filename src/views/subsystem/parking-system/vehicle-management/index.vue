<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 17:46:16
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-09 15:33:52
-->

<template>
  <div class="container">
    <div class="container-record">
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryParams"
        class="demo-form-inline"
      >
        <el-form-item label="车辆类型" prop="vehicleType">
          <el-select
            v-model="queryParams.vehicleType"
            placeholder="请选择车辆类型"
            clearable
          >
            <el-option
              v-for="item in vehicleTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车牌类型" prop="plateType">
          <el-select
            v-model="queryParams.plateType"
            placeholder="请选择车牌类型"
            clearable
          >
            <el-option
              v-for="item in plaotTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="人员姓名" prop="personName">
          <el-input
            v-model="queryParams.personName"
            placeholder="请输入人员姓名"
          ></el-input>
        </el-form-item>

        <el-form-item label="车牌号码" prop="plateNo">
          <el-input
            v-model="queryParams.plateNo"
            placeholder="请输入车牌号码"
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
            添加
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete"
            :disabled="multiple"
          >
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
          label="车辆ID"
          prop="vehicleId"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="车牌号码"
          prop="plateNo"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="是否关联人员"
          prop="isBandPerson"
          header-align="center"
          align="center"
          show-overflow-tooltip
          :formatter="isBandPersonFormat"
        >
        </el-table-column>
        <el-table-column
          label="人员姓名"
          prop="personName"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- 0 标准民用车/军车 1 02式民用车牌 2 武警车车牌 3 警车车牌 4民用车双行尾牌 5 使馆车牌 6 农用车车牌 7 摩托车 8 新能源车 255 其它车牌 -->
        <el-table-column
          label="车牌类型"
          prop="plateType"
          header-align="center"
          align="center"
          :formatter="plateTypeFormat"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="车牌颜色"
          prop="plateColor"
          header-align="center"
          align="center"
          show-overflow-tooltip
          :formatter="plateColorFormat"
        >
        </el-table-column>
        <el-table-column
          label="车辆类型"
          prop="vehicleType"
          header-align="center"
          align="center"
          show-overflow-tooltip
          :formatter="vehicleTypeFormat"
        >
        </el-table-column>
        <el-table-column
          label="车辆颜色"
          prop="vehicleColor"
          header-align="center"
          align="center"
          show-overflow-tooltip
          :formatter="vehicleColorFormat"
        >
        </el-table-column>
        <el-table-column
          label="所属区域名"
          prop="regionName"
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
          label="修改时间"
          prop="updateTime"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
           width="200"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改
            </el-button>
            <el-button  icon="el-icon-view"  @click="handleDetail(scope.row)"
              >详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 新增编辑弹窗 -->
    <add-and-edit-diloag
      ref="modelForm"
      @refresh="getList"
    ></add-and-edit-diloag>

    <!-- 详情弹窗 -->
    <el-dialog
      title="车辆管理详情"
      :visible.sync="dialogDetailVisible"
      width="30%"
    >
      <div class="title-value-box">
        <div class="title-value-item" v-for="item in details" :key="item.id">
          <div class="title-box">{{ item.title }}</div>
          <div class="value-box">{{ item.value }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// API
import {
  getVehicleList,
  deleteVehicle,
  getDetail,
} from "@/api/subsystem/parking-system/vehicle-management.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
// 组件
import AddAndEditDiloag from "./AddAndEditDiloag.vue";
export default {
  mixins: [TableListMixin],
  components: { AddAndEditDiloag },
  data() {
    return {
      // 唯一标识
      rowKey: "vehicleId",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vehicleId: "", //车辆ID
        plateNo: "", //车牌号码
        isBandPerson: "", //是否关联人员
        personName: "", //人员姓名
        plateType: "", //车牌类型
        plateColor: "", //车牌颜色
        vehicleType: "", //车辆类型
        vehicleColor: "", //车辆颜色
        regionName: "", //所属区域名
        // createTime: null, //创建时间
        // updateTime: null, //修改时间
      },
      // 车辆类型列表
      vehicleTypeList: [],
      // 车牌类型
      plaotTypeList: [],
      // 车牌颜色
      plateColorList: [],
      // 车辆颜色
      vehicleColorList: [],
      // 是否关联人员
      isBandPersonList: [],
      // 详情
      details: [],
      // 详情弹窗
      dialogDetailVisible: false,
      interface: {
        // 获取车辆列表
        getTableList: getVehicleList,
      },
    };
  },
  created() {
    // 获取车牌类型字典
    this.getDicts("license_plate_type").then((res) => {
      this.plaotTypeList = res.data;
    });
    // 获取车辆类型列表
    this.getDicts("vehicle_type").then((res) => {
      this.vehicleTypeList = res.data;
    });
    // 车牌颜色列表字典
    this.getDicts("license_plate_color").then((res) => {
      this.plateColorList = res.data;
    });
    // 车辆颜色列表字典
    this.getDicts("vehicle_color").then((res) => {
      this.vehicleColorList = res.data;
    });
    // 是否关联人员
    this.getDicts("is_band_person").then((res) => {
      this.isBandPersonList = res.data;
    });
  },
  methods: {
    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.vehicleId).then(({ data }) => {
        let newData = [],
          template = {
            vehicleId: "车辆ID",
            personId: "人员ID",
            plateNo: "车牌号码",
            isBandPerson: "是否关联人员",
            personName: "人员姓名",
            plateType: "车牌类型",
            plateColor: "车牌颜色",
            vehicleType: "车辆类型",
            vehicleColor: "车辆颜色",
            description: "车辆描述",
            regionIndexCode: "所属区域",
            regionName: "所属区域名",
            createTime: "创建时间",
            updateTime: "修改时间",
          },
          i = 1;

        for (let key in template) {
          if(key == "plateType"){
            data[key] = this.plateTypeFormat(data)
          }else if(key == "vehicleType"){
            data[key] = this.vehicleTypeFormat(data)
          }else if(key == "plateColor"){
            data[key] = this.plateColorFormat(data)
          }else if(key == "vehicleColor"){
            data[key] = this.vehicleColorFormat(data)
          }else if(key == "isBandPerson"){
            data[key] = this.isBandPersonFormat(data)
          }
          newData.push({
            id: i,
            title: template[key],
            value: data[key],
          });
          i++;
        }
        this.details = newData;
        this.dialogDetailVisible = true;
      });
    },

    /** 删除按钮操作 */
    handleDelete(id) {
      const ids = this.selectedRowKeys || id;
      console.log(ids);
      let that = this;
      that
        .$confirm("是否确认删除此数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          return deleteVehicle(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    // 翻译车牌类型 字典
    plateTypeFormat(row, column) {
      return this.selectDictLabel(this.plaotTypeList, row.plateType);
    },

    // 翻译车辆类型 字典
    vehicleTypeFormat(row, column) {
      return this.selectDictLabel(this.vehicleTypeList, row.vehicleType);
    },

    // 翻译车牌颜色 字典
    plateColorFormat(row, column) {
      return this.selectDictLabel(this.plateColorList, row.plateColor);
    },

    // 翻译车辆颜色 字典
    vehicleColorFormat(row, column) {
      return this.selectDictLabel(this.vehicleColorList, row.vehicleColor);
    },
    // 是否关联人员 字典
    isBandPersonFormat(row, column) {
      return this.selectDictLabel(this.isBandPersonList, row.isBandPerson);
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

.title-value-item {
  display: flex;

  .title-box {
    background-color: #eee;
    text-align: center;
    flex: 1;
  }

  .value-box {
    text-align: center;
    flex: 2;
    border-right: 1px solid #777;
  }
}

.title-value-item:first-child {
  border-top: 1px solid #777;
}

.title-value-item > div {
  padding: 0.3em 0;
  border-bottom: 1px solid #777;
  border-left: 1px solid #777;
}
</style>
