<!--
 * @Descripttion: 
 * @Author: JLX
 * @Date: 2022-06-09 18:01:18
 * @LastEditors: JLX
 * @LastEditTime: 2022-06-10 10:28:00
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

        <el-form-item label="资源名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入资源名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="厂商" prop="manufacturer">
          <el-input
            v-model="queryParams.manufacturer"
            placeholder="请输入厂商"
          ></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

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
          label="资源类型"
          prop="resourceType"
          header-align="center"
          align="center"
          show-overflow-tooltip
          :formatter="resourceTypeFormat"
        >
        </el-table-column>
        <el-table-column
          label="资源名称"
          prop="name"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="门禁设备类型编码"
          prop="devTypeCode"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="门禁设备类型型号"
          prop="devTypeDesc"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="厂商"
          prop="manufacturer"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="所属区域"
          prop="regionIndexCode"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="设备卡容量"
          prop="cardCapacity"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="指纹容量"
          prop="fingerCapacity"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="人脸容量"
          prop="faceCapacity"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="门容量"
          prop="doorCapacity"
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
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="200"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" @click="handleDetail(scope.row)"
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

    <!-- 详情弹窗 -->
    <el-dialog
      title="门禁设备列表详情"
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
  getAccessControlList,
  getDetail,
} from "@/api/subsystem/access-control-system/accessControlEquipmentList.js";
// 混入
import { TableListMixin } from "@/mixins/TableListMixin";
export default {
  mixins: [TableListMixin],
  data() {
    return {
      // 唯一标识
      rowKey: "indexCode",
      // 表单数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexCode: "", //资源唯一编码
        resourceType: "", //资源类型
        name: "", //	资源名称
        parentIndexCode: "", //	父级资源编号
        devTypeCode: "", //门禁设备类型编码
        devTypeDesc: "", //门禁设备类型型号
        deviceCode: "", //主动设备编号
        manufacturer: "", //厂商
        regionIndexCode: "", //所属区域
        regionPath: "", //所属区域路径
        treatyType: "", //接入协议
        cardCapacity: "", //设备卡容量
        fingerCapacity: "", //指纹容量
        veinCapacity: "", //指静脉容量
        faceCapacity: "", //人脸容量
        doorCapacity: "", //门容量
        deployId: "", //拨码
        createTime: null, //创建时间
        updateTime: null, //更新时间
        description: "", //描述
        netZoneId: "", //所属网域
        acsReaderVerifyModeAbility: "", //支持认证方式
        regionName: "", //区域名称
        regionPathName: "", //所属区域路径名
        ip: "", //门禁设备IP
        port: "", //门禁设备端口
        capability: "", //设备能力集
        devSerialNum: "", //设备序列号
        dataVersion: "", //版本号
      },
      // 资源类型列表
      resourceTypeList: [],
      // 详情
      details: [],
      // 详情弹窗
      dialogDetailVisible: false,
      interface: {
        // 获取门禁设备列表
        getTableList: getAccessControlList,
      },
    };
  },
  created() {
    // 获取资源类型字典
    this.getDicts("access_control_resource_type").then((res) => {
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
            indexCode: "资源唯一编码",
            resourceType: "资源类型",
            name: "资源名称",
            parentIndexCode: "父级资源编号",
            devTypeCode: "门禁设备类型编码",
            devTypeDesc: "门禁设备类型型号",
            deviceCode: "主动设备编号",
            manufacturer: "厂商",
            regionIndexCode: "所属区域",
            regionPath: "所属区域路径",
            treatyType: "接入协议",
            cardCapacity: "设备卡容量",
            fingerCapacity: "指纹容量",
            veinCapacity: "指静脉容量",
            faceCapacity: "人脸容量",
            doorCapacity: "门容量",
            deployId: "拨码",
            createTime: "创建时间",
            updateTime: "更新时间",
            description: "描述",
            netZoneId: "所属网域",
            acsReaderVerifyModeAbility: "支持认证方式",
            regionName: "区域名称",
            regionPathName: "所属区域路径名",
            ip: "门禁设备IP",
            port: "门禁设备端口",
            devSerialNum: "设备序列号",
            dataVersion: "版本号",
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
