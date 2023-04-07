<template>
  <div class="device-classes">
    <!-- 头部 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="设备类型名称" prop="deviceTypeName">
        <el-input
          v-model="queryParams.deviceTypeName"
          placeholder="请输入设备类型名称"
          size="small"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="所属子系统" prop="subSystemCode">
        <el-select
          v-model="queryParams.subSystemCode"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in systemOptionData"
            :key="item.id"
            :label="item.title"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select
          v-model="queryParams.isStatus"
          placeholder="请选择状态"
          size="small"
          clearable
        >
          <el-option
            v-for="dict in classStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        v-hasPermi="['device:deviceclasses:add']"
        >新增</el-button
      >

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 数据列表 -->
    <el-row
      v-show="total > 0"
      :style="{ height: listHeight + 'px', 'overflow-y': 'auto' }"
      v-loading="loading"
    >
      <thing-model-card
        v-for="item in deviceclassesList"
        :key="item.devicetypeModelId"
        :thingModelInfo="item"
        @trigger="triggers"
      >
      </thing-model-card>
    </el-row>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-empty
      v-show="empty == 0"
      :image-size="300"
      description="数据列表为空"
    ></el-empty>
  </div>
</template>

<script>
import { devicetypeList } from "@/api/device/deviceClasses";
import { TableListMixin } from "@/mixins/TableListMixin";
import { getSystemData } from "@/api/subsystem/system";

import ThingModelCard from "@/components/ThingModelCard";
import ThingDetailsHead from "@/components/ThingDetailsHead";
import ThingDetails from "@/components/ThingDetails";

export default {
  name: "DeviceClasses",
  mixins: [TableListMixin],
  components: {
    ThingModelCard,
    ThingDetailsHead,
    ThingDetails,
  },
  data() {
    return {
      listHeight: 0,
      // 设备类管理表格数据
      deviceclassesList: [],
      // 弹出层标题
      title: "",
      // 启用状态字典
      classStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 设备类型名称
        deviceTypeName: "",
        // 所属子系统
        subSystemCode: "",
        // 状态
        isStatus: "",
      },
      // 子系统字典
      subSystem: [],
      // 获取所有子系统
      systemOptionData: [],
      // 获取所有子系统 字典
      sub_system: [],
      empty: null,
    };
  },

  created() {
    // 获取列表高度
    this.getHeight();
    // 监听页面变化
    window.addEventListener("resize", this.getHeight);
    // 获取状态字典
    this.getDicts("ibms_active_status").then((response) => {
      console.log(response);
      this.classStatusOptions = [...response.data];
    });
    // 获取所有子系统
    this.getSystemData();
    // 获取数据列表
    this.getList();
    // 通过 sub_system 获取所有子系统的字典
    this.getDicts("sub_system").then((response) => {
      this.sub_system = response.data;
    });
  },
  methods: {
    // 获取table表格高度
    getHeight() {
      this.listHeight = window.innerHeight - 300;
    },
    // 获取所有子系统
    getSystemData() {
      console.log("asfasfasfasf");
      getSystemData().then((response) => {
        this.systemOptionData = response.data;
        console.log("获取所有子系统:", this.systemOptionData);
      });
    },

    // 列表子组件给父组件传值
    triggers({ type, id }) {
      if (type == "delete") {
        this.getList();
      } else if (type == "details") {
        this.$router.push({
          name: "ThisngDetails",
          params: { detailsId: id },
        });
      }
    },

    /** 查询设备类管理列表 */
    getList() {
      this.loading = true;
      devicetypeList(this.queryParams).then((response) => {
        let { total, rows } = response;

        console.log("查询设备类管理列表", response);
        this.deviceclassesList = rows.map((item) => {
          item.subSystemText = this.selectDictLabel(
            this.sub_system,
            item.systemId
          );
          item.name = item.deviceTypeName;
          item.id = item.subSystemCode;
          return item;
        });
        console.log("deviceclassesList:", this.deviceclassesList);
        this.total = total;
        this.empty = total;
        this.loading = false;
      });
    },
    // 重置
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        // 设备类型名称
        deviceTypeName: "",
        // 所属子系统
        subSystemCode: "",
        // 状态
        isStatus: "",
      };
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ name: "AddClasses" });
    },
    resetQuery(){
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        // 设备类型名称
        deviceTypeName: "",
        // 所属子系统
        subSystemCode: "",
        // 状态
        isStatus: "",
      }
      this.getList()
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
};
</script>

<style lang="scss" scoped>
.device-classes {
  min-height: calc(100vh - 84px);
  padding: 20px;
}
</style>
