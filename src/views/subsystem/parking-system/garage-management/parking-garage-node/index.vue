<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-07 11:22:41
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 09:34:27
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
        <el-form-item label="资源类型" prop="resourceType">
          <el-select
            v-model="queryParams.resourceType"
            placeholder="请选择资源类型"
            clearable
          >
            <el-option
              v-for="item in resourceTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="父节点类型：" prop="parentResourceType">
          <el-input
            v-model="queryParams.parentResourceType"
            placeholder="请选择父节点类型"
          ></el-input>
        </el-form-item> -->

        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="区域名称" prop="regionName">
          <el-input
            v-model="queryParams.regionName"
            placeholder="请输入区域名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

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
          label="名称"
          prop="name"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="资源类型"
          prop="resourceType"
          header-align="center"
          align="center"
          :formatter="resourceTypeFormat"
        >
        </el-table-column>
        <el-table-column
          label="父节点类型"
          prop="parentResourceType"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="停车库资源名称"
          prop="parkNamePath"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="区域名称"
          prop="regionName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="所属区域路径"
          prop="regionPath"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="区域路径名称"
          prop="regionPathName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
              >详情</el-button
            >
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

    <!-- 详情弹窗 -->
    <el-dialog
      title="停车库节点详情"
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
  getParkingNodeList,
  getDetail,
} from "@/api/subsystem/parking-system/garage-management/parking-garage-node.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 唯一标识
      rowKey: "parkIndexCodes",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "", //名称
        resourceType: null, //资源类型
        parentResourceType: null, //父节点类型
        parkNamePath: "", //停车库资源名称
        createTime: null, //创建时间
        updateTime: null, //更新时间
        regionName: "", //区域名称
        regionPath: "", //所属区域路径
        regionPathName: "", //区域路径名称
      },
      // 表格数据
      tableList: [],

      dialogDetailVisible: false,
      // 详情
      details: [],
      // 资源类型列表
      resourceTypeList: [],
      interface: {
        // 获取停车库节点信息列表
        getTableList: getParkingNodeList,
      },
    };
  },
  created() {
    // 获取资源类型字典
    this.getDicts("resource_type").then((res) => {
      this.resourceTypeList = res.data;
    });
  },
  methods: {
    // 打开详情弹窗
    handleDetail(row) {
      console.log(row);
      getDetail(row.indexCode).then(({ data }) => {
        let newData = [],
          template = {
            createTime: "创建时间",
            name: "名称",
            parentResourceType: "父节点类型",
            parkNamePath: "停车库资源名称",
            regionName: "区域名称",
            regionPathName: "区域路径名称",
            resourceType: "资源类型",
            updateTime: "更新时间",
          },
          i = 1;

        for (let key in template) {
          if (key == "resourceType") {
            data[key] = this.resourceTypeFormat(data);
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

    // 变量数据类型字典翻译 资源类型
    resourceTypeFormat(row, column) {
      return this.selectDictLabel(this.resourceTypeList, row.resourceType);
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
