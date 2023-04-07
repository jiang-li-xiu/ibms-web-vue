<!--
 * @Author: RobertFan
 * @Date: 2022-06-06 17:42:43
 * @LastEditors: RobertFan
<<<<<<< HEAD
 * @LastEditTime: 2022-06-13 12:51:27
=======
 * @LastEditTime: 2022-06-10 16:54:24
>>>>>>> 05c467c11416e2377d8c8a798a9ca0b7b1ffc2ed
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="600px"
      append-to-body
    >
      <h4>基础信息</h4>
      <div class="b">
        <div class="flex-row-cc a">
          <div class="information-name flex-1">标准任务名称</div>
          <div class="information-value flex-3">{{ modelForm.taskName }}</div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">任务描述</div>
          <div class="information-value flex-3">
            {{ modelForm.taskDescribe }}
          </div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">设备类型</div>
          <div class="information-value flex-3">
            {{ modelForm.deviceTypeName }}
          </div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">维保级别</div>
          <div class="information-value flex-3" v-if="modelForm.maintenanceGrade == 0">
            {{modelForm.maintenanceGrade == 0 ? '日常维保' : '无维保级别'}}
          </div>
          <div class="information-value flex-3" v-if="modelForm.maintenanceGrade == 1">
            {{modelForm.maintenanceGrade == 1 ? '月度维保' : '无维保级别'}}
          </div>
          <div class="information-value flex-3" v-if="modelForm.maintenanceGrade == 2">
            {{modelForm.maintenanceGrade == 2 ? '季度维保' : '无维保级别'}}
          </div>
          <div class="information-value flex-3" v-if="modelForm.maintenanceGrade == 3">
            {{modelForm.maintenanceGrade == 3 ? '年度维保' : '无维保级别'}}
          </div>
          <!-- <div class="information-value flex-3" v-else>
            无维保级别
          </div> -->
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">开始时间</div>
          <div class="information-value flex-3">
            {{ modelForm.planStartTime }}
          </div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">结束时间</div>
          <div class="information-value flex-3">
            {{ modelForm.stopTime }}
          </div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">负责人</div>
          <div class="information-value flex-3">
            {{ modelForm.supervisePerson }}
          </div>
        </div>
        <div class="flex-row-cc a">
          <div class="information-name flex-1">维保状态</div>
          <div class="information-value flex-3">
            {{ modelForm.maintenanceState == 0 ? '待维保' : '已维保' }}
          </div>
        </div>
      </div>

      <h4>维保项目</h4>
      <!-- 维保表格数据 -->
      <el-table
        class="table"
        :row-key="rowKey"
        v-loading="loading"
        :data="maintenanceItemsList"
        border
      >
        <!-- <el-table-column label="序号" align="center" prop="serialNumber" /> -->
        <el-table-column label="检查项目" align="center" prop="inspectProject" />
        <el-table-column label="步骤指导" align="center" prop="stepGuidance" />
      </el-table>

      <!-- 维保信息 -->
      <div v-if="this.modelForm.maintenanceState == 1">
        <h4>维保信息</h4>
        <div class="b">
          <div class="flex-row-cc a">
            <div class="information-name flex-1">维保时间</div>
            <div class="information-value flex-3">{{ modelForm.maintenanceTime }}</div>
          </div>
          <div class="flex-row-cc a">
            <div class="information-name flex-1">维保结果</div>
            <div class="information-value flex-3">{{ modelForm.maintenanceResult }}</div>
          </div>
          <div class="flex-row-cc a">
            <div class="information-name flex-1">备注</div>
            <div class="information-value flex-3">{{ modelForm.remark }}</div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetails } from "@/api/maintenance/standerItems";
export default {
  data() {
    return {
      // id
      rowKey: "taskId",
      // 是否加载
      loading: false,
      // 标题
      title: "任务详情",
      // 对话框是否显示
      visible: false,
      // 基础信息数据列表
      modelForm: {
        // taskName: "",
        // taskDescription: "",
        // equipmentType: "",
        // Level: "",
        // startTime: "",
        // endTime: "",
        // status: "",
        // person: "",
      },
      // 维保报个数据列表
      maintenanceItemsList: [],
    };
  },
  methods: {
    /** 触发编辑功能 */
    edit(record) {
      this.loading = true
      getDetails(record.taskId).then((response) => {
        // console.log(response);
        this.modelForm = { ...response.data };
        this.maintenanceItemsList = response.data.projects
        this.loading = false;
      });
      this.visible = true;
    },

    // 关闭按钮
    cancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-row-cs {
  border: 1px solid black;
}
.information-name {
  padding: 10px;
  font-weight: bold;
  text-align: center;
  border-right: 1px solid;
  background-color: #fafafa;
}
.information-value {
  padding: 5px;
}
.b {
  border: 1px solid #eee;
}
.a {
  border-bottom: 1px solid #eee;
}
.a:last-child {
  border-bottom: none;
}
.a:first-child {
  border-bottom: none;
}
</style>
